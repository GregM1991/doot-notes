import type {
	ImageFieldsetListSchema,
	ImageFieldsetSchema,
	NoteEditorSchema,
} from '$lib/schemas'
import type { Readable, Writable } from 'svelte/store'
import type { Infer, SuperValidated } from 'sveltekit-superforms'
import { z } from 'zod'

export type ImageFieldsetList = z.infer<typeof ImageFieldsetListSchema>
export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>

export type InfoBarProps = {
	formId: Writable<string>
	buttonText: string
	submitDelayedReason: string
	delayed: Readable<boolean>
	timeout: Readable<boolean>
}

export type EditNoteProps = {
	data: SuperValidated<Infer<typeof NoteEditorSchema>>
	action: string
	images?: Array<ImageFieldset>
	video?: {
		id: string
		videoKey: string
		thumbnailKey: string
		fileName: string
	} | null
}
