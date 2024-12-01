import { env } from '$env/dynamic/private'
import { uploadResponseSchema } from '$lib/schemas'
import { r2Client } from '$lib/storage/r2.server'
import { getDomainUrl, getNoteVideoThumbSrc } from '$lib/utils/misc'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { VideoMetadata } from './types.video'
import type { BaseVideoHandler } from './VideoHandler/baseVideoHandler'
import { VideoHandlerFactory } from './VideoHandler/videoHandlerFactory'

class VideoUploadProcessor {
	private videoHandler: BaseVideoHandler
	private readonly MAX_CHUNK_SIZE = 5.5 * 1024 * 1024
	private readonly ALLOWED_FORMATS = ['video/mp4', 'video/webm']
	private readonly domain: string

	constructor(request: Request) {
		this.videoHandler = VideoHandlerFactory.create()
		this.domain = getDomainUrl(request)
	}

	async processVideoUpload(
		file: File,
		userId: string,
		onProgress?: (progress: number) => void,
		onMetadata?: (metadata: VideoMetadata) => void,
		onPreviewReady?: (previewUrl: string) => void,
	) {
		if (!this.ALLOWED_FORMATS.includes(file.type)) {
			throw new Error('Unsupported video format')
		}
		let uploadId, fullKey, thumbnailKey: string | undefined
		try {
			const sanitizedName = file.name
				.toLowerCase()
				.replace(/[^a-z0-9.]/g, '-')
				.replace(/-+/g, '-')
			const metadata = await this.videoHandler.getVideoMetadata(file, {
				fileName: sanitizedName,
				originalName: file.name,
				contentType: file.type,
			})
			onMetadata?.(metadata)

			const date = new Date()
			const dateString = date.toISOString().split('T')[0].replace(/-/g, '')
			fullKey = `videos-${userId}-${dateString}-${metadata.fileName}`

			const { uploadId } = await this.initializeMultipartUpload(
				fullKey,
				file.type,
			)

			const chunks = await this.createFileChunks(file)
			const uploadPromises = chunks.map(async (chunk, index) => {
				const presignedUrl = await this.getPresignedUrl({
					uploadId: uploadId,
					key: fullKey!,
					partNumber: index + 1,
				})

				await this.uploadChunk(presignedUrl, chunk)
				onProgress?.(((index + 1) / chunks.length) * 100)
			})
			await Promise.all(uploadPromises)
			const uploadedVideoKey = await this.completeMultipartUpload(
				uploadId,
				fullKey,
			)

			const videoThumbnailBlob = await this.videoHandler.generatePreview(file)
			thumbnailKey = `${fullKey.replace('videos-', 'thumbnails-')}.jpg`
			await this.uploadThumbnail(thumbnailKey, videoThumbnailBlob)

			onPreviewReady?.(getNoteVideoThumbSrc(thumbnailKey))

			return { uploadedVideoKey, thumbnailKey, metadata }
		} catch (error) {
			console.error('Video processing failed', error)
			if (fullKey && uploadId) {
				await this.abortMultipartUpload(fullKey, uploadId)
			}
			if (thumbnailKey) {
				try {
					const deleteCommand = new DeleteObjectCommand({
						Bucket: env.R2_BUCKET_NAME,
						Key: thumbnailKey,
					})
					await r2Client.send(deleteCommand)
				} catch (cleanupError) {
					console.error('Failed to cleanup thumbnail:', cleanupError)
				}
			}
			throw error
		}
	}

	private async uploadThumbnail(key: string, blob: Blob): Promise<void> {
		const response = await fetch(`${this.domain}/api/thumbnail/upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key,
				contentType: 'image/jpeg',
			}),
		})

		if (!response.ok) {
			const text = await response.text()
			throw new Error(
				`Failed to get thumbnail upload URL: ${response.status} - ${text}`,
			)
		}

		const { uploadUrl } = await response.json()
		const uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			body: blob,
			headers: { 'Content-Type': 'image/jpeg' },
		})

		if (!uploadResponse.ok) {
			throw new Error('Failed to upload thumbnail')
		}
	}

	private async initializeMultipartUpload(
		uploadKey: string,
		contentType: string,
	) {
		const response = await fetch(`${this.domain}/api/video/initialize-upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uploadKey, contentType }),
		})

		if (!response.ok) {
			throw new Error('Failed to initialize upload')
		}

		const data = await response.json()
		return { uploadId: data.uploadId, uploadKey: data.uploadKey }
	}

	private async createFileChunks(file: File) {
		const chunks: Blob[] = []
		let start = 0

		while (start < file.size) {
			chunks.push(file.slice(start, start + this.MAX_CHUNK_SIZE))
			start += this.MAX_CHUNK_SIZE
		}

		return chunks
	}

	private async getPresignedUrl(params: {
		uploadId: string
		key: string
		partNumber: number
	}) {
		const response = await fetch(`${this.domain}/api/video/get-upload-url`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
		})

		if (!response.ok) {
			throw new Error('Failed to get presigned URL')
		}

		return response.json()
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

	private async completeMultipartUpload(
		uploadId: string,
		uploadKey: string,
	): Promise<string> {
		const response = await fetch(`${this.domain}/api/video/complete-upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uploadId, uploadKey }),
		})

		if (!response.ok) {
			throw new Error('Failed to complete upload')
		}

		const data = await response.json()
		const parsed = uploadResponseSchema.safeParse(data)

		if (!parsed.success) {
			throw new Error(`Invalid upload response: ${parsed.error.message}`)
		}

		return parsed.data.key
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
