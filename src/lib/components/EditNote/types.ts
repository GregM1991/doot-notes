import { z } from 'zod'
import { zfd } from 'zod-form-data'

export type FlattenedNoteFormErrors = z.inferFlattenedErrors<
	typeof NoteEditorSchema
>['fieldErrors']

export const titleMaxLength = 50
export const titleMinLength = 1
export const contentMaxLength = 10000
export const contentMinLength = 1

export const NoteEditorSchema = zfd.formData({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
})
