import type { ImageFieldsetListSchema, ImageFieldsetSchema } from '$lib/schemas'
import type { Readable, Writable } from 'svelte/store'
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
