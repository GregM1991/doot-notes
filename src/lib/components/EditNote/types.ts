import { z } from 'zod'

export const titleMaxLength = 50
export const titleMinLength = 1
export const contentMaxLength = 10000
export const contentMinLength = 1
export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageFieldsetSchema = z
	.object({
		id: z.string().optional(),
		file: z.instanceof(File).optional(),
		altText: z.string().optional().nullable(),
	})
	.refine(({ file }) => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 3MB')

export const ImageFieldsetListSchema = z.array(ImageFieldsetSchema)
export type ImageFieldsetList = z.infer<typeof ImageFieldsetListSchema>

export const NoteEditorSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
})

export const FullNoteEditorSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
	images: z.array(ImageFieldsetSchema).max(5).optional(),
})

export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>
