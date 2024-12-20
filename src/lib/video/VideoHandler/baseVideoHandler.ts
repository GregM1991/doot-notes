import type { MetadataOptions, VideoMetadata } from '../types.video'

export abstract class BaseVideoHandler {
	abstract getVideoMetadata(
		videoFile: File | Buffer,
		options?: MetadataOptions,
	): Promise<VideoMetadata>

	abstract appendVideoChunk(chunk: ArrayBuffer): Promise<void>

	abstract generatePreview(
		videoData: Buffer | File,
		timeOffset?: number,
	): Promise<Blob | string>

	abstract destroy(): void
}
