import { z } from 'zod'

const MAX_SIZE = 1024 * 1024 * 3 // 3MB

const NewImageSchema = z.object({
	intent: z.literal('submit'),
	photoFile: z
		.instanceof(File)
		.refine(file => file.size > 0, 'Image is required')
		.refine(file => file.size <= MAX_SIZE, 'Image size must be less than 3MB'),
})

const DeleteImageSchema = z.object({
	intent: z.literal('delete'),
})

export const PhotoFormSchema = z.discriminatedUnion('intent', [
	DeleteImageSchema,
	NewImageSchema,
])