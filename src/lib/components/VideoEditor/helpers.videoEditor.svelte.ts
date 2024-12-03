import { getNoteVideoThumbSrc } from '$lib/utils/misc'
import type { VideoEditorProps } from './types.videoEditor'

export function createVideoState(video: VideoEditorProps) {
	let state: { videoThumb: string | null; altText: string } = $state({
		videoThumb: video ? getNoteVideoThumbSrc(video.thumbnailKey) : null,
		altText: '',
	})

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				state.videoThumb = reader.result as string
			}
			reader.readAsDataURL(file)
		} else {
			state.videoThumb = null
		}
	}

	function clearVideo() {
		state.videoThumb = null
	}

	return {
		state,
		handleFileChange,
		clearVideo,
	}
}
