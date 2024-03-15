import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

const titleMaxLength = 50
const titleMinLength = 1
const bodyMaxLength = 10000
const contentMinLength = 1

const NewNoteSchema = zfd.formData({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	body: z.string().min(contentMinLength).max(bodyMaxLength),
})

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const submission = NewNoteSchema.safeParse(formData)
		if (!submission.success) {
			console.log('oh noes')
			const data = {
				data: Object.fromEntries(formData),
				errors: submission.error.flatten().fieldErrors,
			}
			return fail(400, data)
		}

		return { data: submission.data }
	},
} satisfies Actions
