import { uploadResponseSchema } from '$lib/schemas'
import { getDomainUrl } from '$lib/utils/misc'
import { z } from 'zod'
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
		onProgress?: (progress: number) => void,
		onMetadata?: (metadata: VideoMetadata) => void,
		onPreviewReady?: (previewUrl: string) => void,
	) {
		if (!this.ALLOWED_FORMATS.includes(file.type)) {
			throw new Error('Unsupported video format')
		}
		let uploadId: string | undefined
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
			const fullKey = `videos/${dateString}-${metadata.fileName}`
			const initializationResult = await this.initializeMultipartUpload(
				fullKey,
				file.type,
			)
			const { uploadId } = initializationResult
			const chunks = await this.createFileChunks(file)
			const uploadPromises = chunks.map(async (chunk, index) => {
				const presignedUrl = await this.getPresignedUrl({
					uploadId: uploadId,
					key: fullKey,
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
			const previewUrl = await this.generateAndUploadPreview(
				file,
				uploadId,
				fullKey,
			)

			onPreviewReady?.(previewUrl)
			return { uploadedVideoKey, previewUrl }
		} catch (error) {
			console.error('Video processing failed', error)
			if (uploadId) {
				await this.abortMultipartUpload(uploadId)
			}
			throw error
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

	private async generateAndUploadPreview(
		file: File,
		uploadId: string,
		key: string,
	): Promise<string> {
		try {
			const previewBlob = await this.videoHandler.generatePreview(file)
			const previewUploadId = `${uploadId}-preview`
			const previewUrl = await this.getPresignedUrl({
				uploadId: previewUploadId,
				partNumber: 1,
				key,
			})

			await fetch(previewUrl, {
				method: 'PUT',
				body: previewBlob,
				headers: {
					'Content-Type': 'image/jpeg',
				},
			})

			return await this.completePreviewUpload(previewUploadId)
		} catch (error) {
			console.error('Preview generation failed:', error)
			throw new Error('Failed to generate preview')
		}
	}

	private async completePreviewUpload(
		previewUploadId: string,
	): Promise<string> {
		const response = await fetch(`${this.domain}/api/video/complete-preview`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				uploadId: previewUploadId,
			}),
		})

		if (!response.ok) {
			throw new Error('Failed to complete preview upload')
		}

		const data = await response.json()
		const parsed = z.string().url().safeParse(data)

		if (!parsed.success) {
			throw new Error(`Invalid upload response: ${parsed.error.message}`)
		}

		return parsed.data
	}

	private async abortMultipartUpload(uploadId: string): Promise<void> {
		if (!uploadId) {
			throw new Error('Invalid uploadId provided for abort')
		}

		try {
			// Notify R2 to abort the upload and clean up chunks
			const response = await fetch(`${this.domain}/api/video/abort-upload`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ uploadId }),
			})

			if (!response.ok) {
				console.error('Failed to abort upload cleanly')
			}

			// Also try to clean up preview if it exists
			try {
				await fetch(`${this.domain}/api/video/abort-upload`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						uploadId: `${uploadId}-preview`,
					}),
				})
			} catch (previewError) {
				console.error('Failed to clean up preview:', previewError)
			}
		} catch (error) {
			console.error('Error during upload abort:', error)
			// We throw this error as it might be important for the calling code
			throw new Error('Failed to abort upload cleanly')
		}
	}

	destroy() {
		this.videoHandler.destroy()
	}
}

export default VideoUploadProcessor
