import type { VideoMetadata } from './types.video'

class VideoHandler {
	private video: HTMLVideoElement
	private mediaSource: MediaSource | null = null
	private sourceBuffer: SourceBuffer | null = null

	constructor() {
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

	async getVideoMetadata(videoFile: File): Promise<VideoMetadata> {
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
					}

					URL.revokeObjectURL(url)
					resolve(metadata)
				} catch (error) {
					reject(error)
				}
				this.video.onerror = () => {
					URL.revokeObjectURL(url)
					reject(new Error('Failed to load video'))
				}
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

	async appendVideoChunk(chunk: ArrayBuffer) {
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

	destroy() {
		if (this.mediaSource && this.mediaSource.readyState === 'open') {
			this.mediaSource.endOfStream()
		}
		URL.revokeObjectURL(this.video.src)
		this.video.remove()
	}
}

export default VideoHandler
