import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export type FlattenedNoteFormErrors = z.inferFlattenedErrors<
	typeof NewNoteSchema
>['fieldErrors']

const titleMaxLength = 50
const titleMinLength = 1
const contentMaxLength = 10000
const contentMinLength = 1

const NewNoteSchema = zfd.formData({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
})

export const actions = {
	default: async ({ request }) => {
		console.log('server')
		const formData = await request.formData()
		const submission = NewNoteSchema.safeParse(formData)
		if (!submission.success) {
			const errorData = submission.error.flatten()
				.fieldErrors as FlattenedNoteFormErrors //TODO: See if there's a better way to do this - ,-

			const data = {
				data: Object.fromEntries(formData),
				errors: errorData,
			}
			return fail(400, data)
		}

		return { data: submission.data }
	},
} satisfies Actions
