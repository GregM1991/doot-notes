import { getNoteVideoThumbSrc } from '$lib/utils/misc'
import { BrowserVideoHandler } from '$lib/video/VideoHandler/browserVideoHandler'
import { VideoHandlerFactory } from '$lib/video/VideoHandler/videoHandlerFactory'
import type { VideoEditorProps, VideoEditorState } from './types.videoEditor'

const NAME_PLACEHOLDER = 'Upload a video note'

export function createVideoState(video: Partial<VideoEditorProps>) {
	let state: VideoEditorState = $state({
		videoThumb: video?.thumbnailKey
			? getNoteVideoThumbSrc(video.thumbnailKey)
			: null,
		altText: '',
		fileInput: null,
		videoLabelCopy: video?.fileName ?? NAME_PLACEHOLDER,
		videoHandler: null,
	})

	async function handleFileChange() {
		const file = state.fileInput?.files?.[0] ?? null

		if (file) {
			const videoHandler = await VideoHandlerFactory.create()
			if (videoHandler instanceof BrowserVideoHandler) {
				const previewThumb = await videoHandler.generatePreview(file)
				state.videoThumb = previewThumb
			}
			state.videoLabelCopy = file.name
		} else {
			clearFileState()
		}
	}

	function clearFileState() {
		state.videoThumb = null
		state.altText = ''
		state.videoLabelCopy = NAME_PLACEHOLDER

		if (state.fileInput) {
			state.fileInput.value = ''
		}
	}

	return {
		state,
		handleFileChange,
		deleteVideo() {
			clearFileState()
		},
	}
}
