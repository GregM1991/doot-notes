import { type z } from 'zod'
import {
	type ImageFieldsetListSchema,
	type ImageFieldsetSchema,
} from '$lib/schemas'

export type ImageFieldsetList = z.infer<typeof ImageFieldsetListSchema>
export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>
