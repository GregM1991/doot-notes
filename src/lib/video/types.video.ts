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

export interface MetadataOptions {
	fileName: string
	originalName: string
	contentType: string
}
