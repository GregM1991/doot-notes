import { extractVideoGroup, isErrorWithMessage } from '$lib/utils/misc'
import { VideoFieldSchema } from '$lib/schemas'
import VideoUploadProcessor from '$lib/video/videoUploadProcessor'
import type { VideoMetadata } from '$lib/video/types.video'
import { cleanupVideoAssets } from './utils'

export async function handleNewOrUpdateVideo(
	userId: string,
	request: Request,
	formData: FormData,
) {
	const video = extractVideoGroup(formData)
	const videoSubmission = VideoFieldSchema.safeParse(video)

	if (!videoSubmission.success)
		return { error: videoSubmission.error.formErrors.formErrors }
	const videoProcessor = new VideoUploadProcessor(request)

	const { file, id: videoId } = videoSubmission.data

	if (videoId && file) {
		await cleanupVideoAssets(videoId, request)
	}

	let videoData:
		| (VideoMetadata & { videoKey: string; thumbnailKey: string })
		| null = null

	if (file) {
		try {
			const { uploadedVideoKey, thumbnailKey, metadata } =
				await videoProcessor.processVideoUpload(file, userId)
			videoData = {
				videoKey: uploadedVideoKey,
				thumbnailKey,
				...metadata,
			}
		} catch (error) {
			if (isErrorWithMessage(error)) {
				console.error(error.message)
				return { error: error.message }
			}
			return { error: 'Unable to upload video' }
		}
	}
	return { videoData, videoId, error: null }
}
