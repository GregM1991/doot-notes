import { uploadResponseSchema } from '$lib/schemas'
import type { VideoMetadata } from './types.video'
import VideoHandler from './videoHandler'

class VideoUploadProcessor {
	private videoHandler: VideoHandler
	private readonly MAX_CHUNK_SIZE = 2 * 1024 * 1024
	private readonly ALLOWED_FORMATS = ['video/mp4', 'video/webm']
	private readonly presignedUrlEndpoint = '/api/get-upload-url'

	constructor() {
		this.videoHandler = new VideoHandler()
	}

	async processVideoUpload(
		file: File,
		onProgress: (progress: number) => void,
		onMetadata: (metadata: VideoMetadata) => void,
		onPreviewReady: (previewUrl: string) => void,
	) {
		if (!this.ALLOWED_FORMATS.includes(file.type)) {
			throw new Error('Unsupported video format')
		}
		let uploadId: string | undefined
		try {
			const metadata = await this.videoHandler.getVideoMetadata(file)
			onMetadata(metadata)

			uploadId = crypto.randomUUID()

			await this.initializeMultipartUpload(uploadId, file.type)

			const chunks = await this.createFileChunks(file)
			const uploadPromises = chunks.map(async (chunk, index) => {
				const presignedUrl = await this.getPresignedUrl({
					uploadId: uploadId!,
					partNumber: index + 1,
					contentType: file.type,
				})

				await this.uploadChunk(presignedUrl, chunk)
				onProgress(((index + 1) / chunks.length) * 100)
			})

			await Promise.all(uploadPromises)

			const finalUrl = await this.completeMultipartUpload(uploadId)

			const previewUrl = await this.generateAndUploadPreview(file, uploadId)

			onPreviewReady(previewUrl)
			return finalUrl
		} catch (error) {
			console.error('Video processing failed', error)
			if (uploadId) {
				await this.abortMultipartUpload(uploadId)
			}
			throw error
		}
	}

	private async initializeMultipartUpload(
		uploadId: string,
		contentType: string,
	) {
		const response = await fetch('/api/initialize-upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uploadId, contentType }),
		})

		if (!response.ok) {
			throw new Error('Failed to initialize upload')
		}
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
		partNumber: number
		contentType: string
	}) {
		const response = await fetch(this.presignedUrlEndpoint, {
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

	private async completeMultipartUpload(uploadId: string): Promise<string> {
		const response = await fetch('/api/complete-upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ uploadId }),
		})

		if (!response.ok) {
			throw new Error('Failed to complete upload')
		}

		const data = await response.json()
		const parsed = uploadResponseSchema.safeParse(data)

		if (!parsed.success) {
			throw new Error(`Invalid upload response: ${parsed.error.message}`)
		}

		return parsed.data.url
	}

	private async generateAndUploadPreview(
		file: File,
		uploadId: string,
	): Promise<string> {
		try {
			// Create canvas for preview
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			if (!ctx) {
				throw new Error('Could not get canvas context')
			}

			// Create video element for frame extraction
			const video = document.createElement('video')

			// Load video file
			const videoUrl = URL.createObjectURL(file)
			video.src = videoUrl

			// Wait for video metadata to load
			await new Promise<void>((resolve, reject) => {
				video.onloadedmetadata = () => resolve()
				video.onerror = () => reject(new Error('Failed to load video'))
			})

			// Set canvas dimensions
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight

			// Generate preview from frame at 25% of video duration
			const previewFrame = await new Promise<string>((resolve, reject) => {
				try {
					video.currentTime = video.duration * 0.25

					video.onseeked = () => {
						// Draw video frame to canvas
						ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

						// Convert to JPEG data URL
						const previewData = canvas.toDataURL('image/jpeg', 0.8)
						resolve(previewData)
					}

					video.onerror = () => reject(new Error('Failed to seek video'))
				} catch (error) {
					reject(error)
				} finally {
					// Clean up
					URL.revokeObjectURL(videoUrl)
					video.remove()
				}
			})

			// Convert data URL to Blob
			const previewBlob = await fetch(previewFrame).then(res => res.blob())

			// Upload preview to R2
			const previewUploadId = `${uploadId}-preview`

			// Get presigned URL for preview upload
			const previewUrl = await this.getPresignedUrl({
				uploadId: previewUploadId,
				partNumber: 1,
				contentType: 'image/jpeg',
			})

			// Upload preview image
			await fetch(previewUrl, {
				method: 'PUT',
				body: previewBlob,
				headers: {
					'Content-Type': 'image/jpeg',
				},
			})

			// Get final preview URL
			return await this.completePreviewUpload(previewUploadId)
		} catch (error) {
			console.error('Preview generation failed:', error)
			throw new Error('Failed to generate preview')
		}
	}

	private async completePreviewUpload(
		previewUploadId: string,
	): Promise<string> {
		const response = await fetch('/api/complete-preview', {
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
		const parsed = uploadResponseSchema.safeParse(data)

		if (!parsed.success) {
			throw new Error(`Invalid upload response: ${parsed.error.message}`)
		}

		return parsed.data.url
	}

	private async abortMultipartUpload(uploadId: string): Promise<void> {
		if (!uploadId) {
			throw new Error('Invalid uploadId provided for abort')
		}

		try {
			// Notify R2 to abort the upload and clean up chunks
			const response = await fetch('/api/abort-upload', {
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
				await fetch('/api/abort-upload', {
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
