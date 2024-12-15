import type { VideoEditorVideo } from '../types.components'

export type VideoEditorProps = VideoEditorVideo | null | undefined

export interface VideoEditorState {
	videoThumb: string | null
	altText: string
	fileInput: HTMLInputElement | null
	videoLabelCopy: string | undefined
}
