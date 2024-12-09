// types.video.ts
export type VideoMetadata = {
	duration: number
	width: number
	height: number
	frameRate: number
	codec: string
	fileName: string
	bitrate: number
	originalName: string
	contentType: string
}

export type VideoUploadStatus =
	| { state: 'idle' }
	| { state: 'preparing'; progress: number }
	| { state: 'uploading'; progress: number }
	| { state: 'processing'; progress: number }
	| { state: 'complete'; metadata: VideoMetadata }
	| { state: 'error'; error: string }

export interface VideoUploadOptions {
	maxChunkSize?: number
	allowedFormats?: string[]
	previewTimeOffset?: number
}

export interface VideoUploadContext {
	uploadId?: string
	key?: string
	chunks?: number
	currentChunk?: number
	abortController?: AbortController
	thumbnailKey?: string
}

export interface MetadataOptions {
	fileName: string
	originalName: string
	contentType: string
}

export type UploadProgressCallback = (status: VideoUploadStatus) => void
