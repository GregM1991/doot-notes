import type { ImageFieldsetListSchema, ImageFieldsetSchema } from '$lib/schemas'
import { z } from 'zod'

export type ImageFieldsetList = z.infer<typeof ImageFieldsetListSchema>
export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>
