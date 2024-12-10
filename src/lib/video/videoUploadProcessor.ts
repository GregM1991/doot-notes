// videoUploadProcessor.ts
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server'
import { getDomainUrl, invariant } from '$lib/utils/misc'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import type {
	UploadProgressCallback,
	VideoUploadContext,
	VideoUploadOptions,
} from './types.video'
import { VideoHandlerFactory } from './VideoHandler/videoHandlerFactory'
import { ServerVideoHandler } from './VideoHandler/serverVideoHandler.server'
import type { BaseVideoHandler } from './VideoHandler/baseVideoHandler'
import { createVideoUploadError, VideoErrorCode } from './videoUploadErrors'

class VideoUploadProcessor {
	private readonly context: VideoUploadContext = {}
	private readonly options: Required<VideoUploadOptions>

	constructor(
		private readonly videoHandler: BaseVideoHandler,
		private readonly domain: string,
		options?: VideoUploadOptions,
	) {
		this.options = {
			maxChunkSize: 5.5 * 1024 * 1024,
			allowedFormats: ['video/mp4', 'video/webm'],
			previewTimeOffset: 0.25,
			...options,
		}
	}

	static async initialize(request: Request, options?: VideoUploadOptions) {
		const handler = await VideoHandlerFactory.create()
		const domain = getDomainUrl(request)
		return new VideoUploadProcessor(handler, domain, options)
	}

	private validateFile(file: File) {
		if (!this.options.allowedFormats.includes(file.type)) {
			throw createVideoUploadError(VideoErrorCode.INVALID_FORMAT)
		}
	}

	private generateUploadKey(fileName: string, userId: string) {
		const date = new Date()
		const dateString = date.toISOString().split('T')[0].replace(/-/g, '')
		this.context.key = `videos-${userId}-${dateString}-${fileName}`
	}

	async processVideoUpload(
		file: File,
		userId: string,
		onProgress?: UploadProgressCallback,
	) {
		this.validateFile(file)

		try {
			onProgress?.({ state: 'preparing', progress: 0 })

			const sanitizedName = file.name
				.toLowerCase()
				.replace(/[^a-z0-9.]/g, '-')
				.replace(/-+/g, '-')
			const metadata = await this.videoHandler.getVideoMetadata(file, {
				fileName: sanitizedName,
				originalName: file.name,
				contentType: file.type,
			})
			this.generateUploadKey(metadata.fileName, userId)

			await this.initializeMultipartUpload(file.type)
			await this.uploadChunks(file, onProgress)
			await this.completeMultipartUpload()
			await this.uploadThumbnail(file)

			return {
				uploadedVideoKey: this.context.key,
				thumbnailKey: this.context.thumbnailKey,
				metadata,
			}
		} catch (error) {
			console.error('Video processing failed', error)
			if (this.context.key && this.context.uploadId) {
				await this.abortMultipartUpload(this.context.key, this.context.uploadId)
			}
			if (this.context.thumbnailKey) {
				try {
					const deleteCommand = new DeleteObjectCommand({
						Bucket: env.R2_BUCKET_NAME,
						Key: this.context.thumbnailKey,
					})
					await r2Client.send(deleteCommand)
				} catch (cleanupError) {
					console.error('Failed to cleanup thumbnail:', cleanupError)
				}
			}
			throw error
		}
	}

	private async uploadThumbnail(file: File): Promise<void> {
		if (!(this.videoHandler instanceof ServerVideoHandler))
			throw new Error('Handler should not exist in this environment')

		const videoThumbnailBlob = await this.videoHandler.generatePreview(file)
		invariant(this.context.key, 'No key exists for this video')
		this.context.thumbnailKey = `${this.context.key.replace('videos-', 'thumbnails-')}.jpg`

		const response = await fetch(`${this.domain}/api/thumbnail/upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key: this.context.thumbnailKey,
				videoThumbnailBlob,
				contentType: 'image/jpeg',
			}),
		})
		if (!response.ok) {
			createVideoUploadError(VideoErrorCode.UPLOAD_THUMBNAIL_FAILED)
		}
	}

	private async initializeMultipartUpload(contentType: string) {
		const response = await fetch(`${this.domain}/api/video/initialize-upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uploadKey: this.context.key, contentType }),
		})

		if (!response.ok) {
			createVideoUploadError(VideoErrorCode.UPLOAD_INITIALIZATION_FAILED)
		}

		const data = await response.json()
		this.context.uploadId = data.uploadId
		this.context.key = data.uploadKey
	}

	private async getPresignedUrl(partNumber: number) {
		// TODO: Create an api layer
		const response = await fetch(`${this.domain}/api/video/get-upload-url`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				partNumber,
				key: this.context.key,
				uploadId: this.context.uploadId,
			}),
		})

		if (!response.ok) {
			throw new Error('Failed to get presigned URL')
		}

		return response.json()
	}

	private async createFileChunks(file: File) {
		const chunks: Blob[] = []
		let start = 0

		while (start < file.size) {
			chunks.push(file.slice(start, start + this.options.maxChunkSize))
			start += this.options.maxChunkSize
		}

		return chunks
	}

	private async uploadChunks(file: File, onProgress?: UploadProgressCallback) {
		const chunks = await this.createFileChunks(file)

		const uploadPromises = chunks.map(async (chunk, index) => {
			const presignedUrl = await this.getPresignedUrl(index + 1)

			await this.uploadChunk(presignedUrl, chunk)
			onProgress?.({
				state: 'uploading',
				progress: ((index + 1) / chunks.length) * 100,
			})
		})
		await Promise.all(uploadPromises)
	}

	private async uploadChunk(presignedUrl: string, chunk: Blob, retries = 3) {
		for (let attempt = 0; attempt < retries; attempt++) {
			try {
				const response = await fetch(presignedUrl, {
					method: 'PUT',
					body: chunk,
					headers: { 'Content-Type': 'application/octet-stream' },
				})
				if (response.ok) return
			} catch (error) {
				if (attempt === retries - 1) throw error
				await new Promise(resolve =>
					setTimeout(resolve, 1000 * Math.pow(2, attempt)),
				)
			}
		}
	}

	private async completeMultipartUpload() {
		const response = await fetch(`${this.domain}/api/video/complete-upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				uploadId: this.context.uploadId,
				uploadKey: this.context.key,
			}),
		})

		if (!response.ok) {
			throw new Error('Failed to complete upload')
		}
	}

	private async abortMultipartUpload(
		videoKey: string,
		uploadId: string,
	): Promise<void> {
		if (!videoKey || !uploadId) {
			throw new Error('Invalid videoKey or videoId provided for abort')
		}

		try {
			const response = await fetch(`${this.domain}/api/video/abort-upload`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ videoKey, uploadId }),
			})

			if (!response.ok) {
				console.error('Failed to abort upload cleanly')
			}
		} catch (error) {
			console.error('Error during upload abort:', error)
			throw new Error('Failed to abort upload cleanly')
		}
	}

	destroy() {
		this.videoHandler.destroy()
	}
}

export default VideoUploadProcessor
