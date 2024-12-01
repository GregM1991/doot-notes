import { getDomainUrl, invariantResponse } from '$lib/utils/misc.js'
import { VideoHandlerFactory } from '$lib/video/VideoHandler/videoHandlerFactory.js'

export const load = async ({ parent, request }) => {
	const parentData = await parent()
	invariantResponse(
		parentData.note?.video?.videoKey,
		'Note does not have video file',
	)
	const videoUrl = `${getDomainUrl(request)}/api/video/${parentData.note.video.videoKey}`
	const videoHandler = VideoHandlerFactory.create()
	const videoResponse = await fetch(videoUrl, {
		method: 'GET',
	})
	const video = await videoResponse.json()
	const videoMetadata = await videoHandler.getVideoMetadata(video)
	return {
		video,
		videoMetadata,
	}
}
