import { BaseVideoHandler } from './baseVideoHandler'
import { spawn } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import crypto from 'crypto'
import type { MetadataOptions, VideoMetadata } from '../types.video'
import { dev } from '$app/environment'

export class ServerVideoHandler extends BaseVideoHandler {
	private async saveTempFile(buffer: Buffer): Promise<string> {
		const tempFileName = `video-${crypto.randomBytes(16).toString('hex')}`
		const tempPath = join(tmpdir(), tempFileName)
		await writeFile(tempPath, buffer)
		return tempPath
	}

	private async cleanupTempFile(path: string): Promise<void> {
		try {
			await unlink(path)
		} catch (error) {
			console.error('Failed to cleanup temp file:', error)
		}
	}

	private runFfprobe(filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const process = spawn('ffprobe', [
				'-v',
				'quiet',
				'-print_format',
				'json',
				'-show_format',
				'-show_streams',
				filePath,
			])

			let outputData = ''
			let errorData = ''

			process.stdout.on('data', data => {
				outputData += data
			})

			process.stderr.on('data', data => {
				errorData += data
			})

			process.on('close', code => {
				if (code === 0) {
					resolve(outputData)
				} else {
					reject(new Error(`ffprobe process failed: ${errorData}`))
				}
			})
		})
	}

	private parseFrameRate(rationalStr: string): number {
		const [num, den] = rationalStr.split('/').map(Number)
		return Math.round(num / den)
	}

	async getVideoMetadata(
		videoBuffer: Buffer | File,
		options?: MetadataOptions,
	): Promise<VideoMetadata> {
		let buffer: Buffer
		let metadataOptions: MetadataOptions

		if (videoBuffer instanceof File) {
			buffer = Buffer.from(await videoBuffer.arrayBuffer())
			metadataOptions = options || {
				fileName: videoBuffer.name,
				originalName: videoBuffer.name,
				contentType: videoBuffer.type,
			}
		} else {
			buffer = videoBuffer
			metadataOptions = options || {
				fileName: 'unknown',
				originalName: 'unknown',
				contentType: 'video/mp4',
			}
		}

		const tempPath = await this.saveTempFile(buffer)

		try {
			const ffprobeOutput = await this.runFfprobe(tempPath)
			const data = JSON.parse(ffprobeOutput)
			const videoStream = data.streams.find(
				(stream: { codec_type: string }) => stream.codec_type === 'video',
			)

			if (!videoStream) {
				throw new Error('No video stream found in file')
			}

			const bitrate = parseInt(
				videoStream.bit_rate || data.format.bit_rate || '0',
			)

			return {
				duration: parseFloat(data.format.duration),
				width: videoStream.width,
				height: videoStream.height,
				frameRate: this.parseFrameRate(videoStream.r_frame_rate),
				codec: videoStream.codec_name === 'h264' ? 'H.264' : 'unknown',
				fileName: metadataOptions.fileName,
				originalName: metadataOptions.originalName,
				contentType: metadataOptions.contentType,
				bitrate,
			}
		} finally {
			await this.cleanupTempFile(tempPath)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async appendVideoChunk(_chunk: ArrayBuffer): Promise<void> {
		return Promise.resolve()
	}

	async generatePreview(
		videoData: Buffer | File,
		timeOffset: number = 0.25,
	): Promise<Blob> {
		let buffer: Buffer
		if (videoData instanceof File) {
			buffer = Buffer.from(await videoData.arrayBuffer())
		} else {
			buffer = videoData
		}

		const tempPath = await this.saveTempFile(buffer)

		try {
			const metadata = await this.getVideoMetadata(buffer)
			const seekTime = metadata.duration * timeOffset

			const previewBuffer = await this.extractFrame(tempPath, seekTime)

			return new Blob([previewBuffer], { type: 'image/jpeg' })
		} finally {
			await this.cleanupTempFile(tempPath)
		}
	}

	private extractFrame(filePath: string, seekTime: number): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = []

			const process = spawn('ffmpeg', [
				'-hide_banner',
				'-loglevel',
				dev ? 'info' : 'error',
				'-ss',
				seekTime.toString(),
				'-i',
				filePath,
				'-vframes',
				'1',
				'-vf',
				'scale=320:-1',
				'-q:v',
				'5',
				'-f',
				'image2pipe',
				'-c:v',
				'mjpeg',
				'pipe:1',
			])

			process.stdout.on('data', chunk => chunks.push(chunk))
			process.stderr.on('data', data => console.error(`ffmpeg stderr: ${data}`))

			process.on('close', code => {
				if (code === 0) {
					resolve(Buffer.concat(chunks))
				} else {
					reject(new Error(`ffmpeg process failed with code ${code}`))
				}
			})

			process.on('error', reject)
		})
	}

	destroy() {}
}
