interface VideoEditorVideo {
	id: string
	videoKey: string
	thumbnailKey: string
	fileName: string
}

export type VideoEditorProps = VideoEditorVideo | null | undefined
