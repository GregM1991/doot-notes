import { z } from 'zod'

export const titleMaxLength = 50
export const titleMinLength = 1
export const contentMaxLength = 10000
export const contentMinLength = 1

export const NoteEditorSchema = z.object({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
	id: z.string(),
})
