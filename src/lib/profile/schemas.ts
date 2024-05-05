import { z } from 'zod'

const MAX_SIZE = 1024 * 1024 * 3 // 3MB

const intents = ['submit', 'delete'] as const

export const PhotoFormSchema = z.object({
	intent: z.enum(intents),
	photoFile: z
		.instanceof(File)
		.refine(file => file.size > 0, 'Image is required')
		.refine(file => file.size <= MAX_SIZE, 'Image size must be less than 3MB'),
})