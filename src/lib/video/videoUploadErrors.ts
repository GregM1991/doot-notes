export class VideoUploadError extends Error {
	constructor(
		message: string,
		public readonly code: VideoErrorCode,
		public readonly details?: unknown,
	) {
		super(message)
		this.name = 'VideoUploadError'
	}
}

export enum VideoErrorCode {
	INVALID_FORMAT = 'INVALID_FORMAT',
	CHUNK_UPLOAD_FAILED = 'CHUNK_UPLOAD_FAILED',
	UPLOAD_INITIALIZATION_FAILED = 'UPLOAD_INITIALIZATION_FAILED',
	METADATA_EXTRACTION_FAILED = 'METADATA_EXTRACTION_FAILED',
	PREVIEW_GENERATION_FAILED = 'PREVIEW_GENERATION_FAILED',
	UPLOAD_ABORTED = 'UPLOAD_ABORTED',
	UPLOAD_THUMBNAIL_FAILED = 'UPLOAD_THUMBNAIL_FAILED',
	PRESIGNED_URL_FAILED = 'PRESIGNED_URL_FAILED',
}

export const createVideoUploadError = (
	code: VideoErrorCode,
	details?: unknown,
) => {
	const messages = {
		[VideoErrorCode.INVALID_FORMAT]: 'Unsupported video format',
		[VideoErrorCode.CHUNK_UPLOAD_FAILED]: 'Failed to upload video chunk',
		[VideoErrorCode.UPLOAD_INITIALIZATION_FAILED]:
			'Failed to initialize upload',
		[VideoErrorCode.METADATA_EXTRACTION_FAILED]:
			'Failed to extract video metadata',
		[VideoErrorCode.PREVIEW_GENERATION_FAILED]:
			'Failed to generate video preview',
		[VideoErrorCode.UPLOAD_ABORTED]: 'Upload was aborted',
		[VideoErrorCode.UPLOAD_THUMBNAIL_FAILED]: 'Failed to upload thumbnail',
		[VideoErrorCode.PRESIGNED_URL_FAILED]: 'Unable to get pre-signed url',
	}

	return new VideoUploadError(messages[code], code, details)
}
