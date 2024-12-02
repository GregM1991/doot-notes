import {
	extractVideoGroup,
	getDomainUrl,
	isErrorWithMessage,
} from '$lib/utils/misc'
import { VideoFieldSchema } from '$lib/schemas'
import VideoUploadProcessor from '$lib/video/videoUploadProcessor'
import type { VideoMetadata } from '$lib/video/types.video'
import { prisma } from '$lib/utils/db.server'

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
		const video = await prisma.video.findFirst({
			where: { id: videoId },
			select: {
				videoKey: true,
				thumbnailKey: true,
			},
		})
		console.log({ videoId, video })
		// TODO: Come up with a better api layer system
		if (video?.videoKey)
			await fetch(`${getDomainUrl(request)}/api/video/delete/${video.videoKey}`)
		if (video?.thumbnailKey)
			await fetch(
				`${getDomainUrl(request)}/api/thumbnail/delete/${video.thumbnailKey}`,
			)
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
