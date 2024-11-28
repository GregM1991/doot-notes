import type { MetadataOptions, VideoMetadata } from '../types.video'
import { BaseVideoHandler } from './baseVideoHandler'

export class BrowserVideoHandler extends BaseVideoHandler {
	private video: HTMLVideoElement
	private mediaSource: MediaSource | null = null
	private sourceBuffer: SourceBuffer | null = null

	constructor() {
		super()
		if (typeof document === 'undefined') {
			throw new Error(
				'BrowserVideoHandler can only be used in browser environments',
			)
		}
		this.video = document.createElement('video')
		this.setupMediaSource()
	}

	private async setupMediaSource() {
		this.mediaSource = new MediaSource()
		this.video.src = URL.createObjectURL(this.mediaSource)

		await new Promise<void>(resolve => {
			this.mediaSource!.addEventListener('sourceopen', () => {
				const mimeType = 'video/mp4; codecs="avc1.42E01E"'

				if (MediaSource.isTypeSupported(mimeType)) {
					this.sourceBuffer = this.mediaSource!.addSourceBuffer(mimeType)
					resolve()
				}
			})
		})
	}

	async getVideoMetadata(
		videoFile: File,
		options: MetadataOptions,
	): Promise<VideoMetadata> {
		const url = URL.createObjectURL(videoFile)

		return new Promise((resolve, reject) => {
			this.video.src = url

			this.video.onloadedmetadata = async () => {
				try {
					const videoTrack = (
						await VideoDecoder.isConfigSupported({
							codec: 'avc1.42E01E',
							codedWidth: this.video.width,
							codedHeight: this.video.height,
						})
					).supported

					const metadata: VideoMetadata = {
						duration: this.video.duration,
						width: this.video.width,
						height: this.video.height,
						frameRate: await this.detectFrameRate(),
						codec: videoTrack ? 'H.264' : 'unknown',
						fileName: options.fileName,
						originalName: options.originalName,
						contentType: options.contentType,
					}

					URL.revokeObjectURL(url)
					resolve(metadata)
				} catch (error) {
					reject(error)
				}
			}

			this.video.onerror = () => {
				URL.revokeObjectURL(url)
				reject(new Error('Failed to load video'))
			}
		})
	}

	private async detectFrameRate(): Promise<number> {
		let lastTime = 0
		let frameCount = 0
		const frameTimes: number[] = []

		return new Promise(resolve => {
			const checkFrame = () => {
				if (this.video.currentTime !== lastTime) {
					frameTimes.push(this.video.currentTime - lastTime)
					lastTime = this.video.currentTime
					frameCount++

					if (frameCount >= 10) {
						const avgFrameTime =
							frameTimes.reduce((a, b) => a + b) / frameTimes.length
						resolve(Math.round(1 / avgFrameTime))
						return
					}
				}
				requestAnimationFrame(checkFrame)
			}
			this.video.play()
			checkFrame()
		})
	}

	async appendVideoChunk(chunk: ArrayBuffer): Promise<void> {
		if (!this.sourceBuffer || this.sourceBuffer.updating) {
			return
		}

		return new Promise<void>((resolve, reject) => {
			this.sourceBuffer!.addEventListener('updateend', () => resolve(), {
				once: true,
			})
			this.sourceBuffer!.addEventListener('error', reject, { once: true })

			try {
				this.sourceBuffer!.appendBuffer(chunk)
			} catch (error) {
				reject(error)
			}
		})
	}

	async generatePreview(
		videoFile: File,
		timeOffset: number = 0.25,
	): Promise<Blob> {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		if (!ctx) {
			throw new Error('Could not get canvas context')
		}

		const video = document.createElement('video')
		const videoUrl = URL.createObjectURL(videoFile)
		video.src = videoUrl

		try {
			await new Promise<void>((resolve, reject) => {
				video.onloadedmetadata = () => resolve()
				video.onerror = () => reject(new Error('Failed to load video'))
			})

			canvas.width = video.videoWidth
			canvas.height = video.videoHeight

			const previewFrame = await new Promise<string>((resolve, reject) => {
				try {
					video.currentTime = video.duration * timeOffset

					video.onseeked = () => {
						ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
						const previewData = canvas.toDataURL('image/jpeg', 0.8)
						resolve(previewData)
					}

					video.onerror = () => reject(new Error('Failed to seek video'))
				} catch (error) {
					reject(error)
				}
			})

			return await fetch(previewFrame).then(res => res.blob())
		} finally {
			URL.revokeObjectURL(videoUrl)
			video.remove()
		}
	}

	destroy() {
		if (this.mediaSource && this.mediaSource.readyState === 'open') {
			this.mediaSource.endOfStream()
		}
		URL.revokeObjectURL(this.video.src)
		this.video.remove()
	}
}
