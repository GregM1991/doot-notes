import type { Actions } from './$types'
import { z } from 'zod'

const titleMaxLength = 50
const titleMinLength = 1
const bodyMaxLength = 10000
const contentMinLength = 1

const NewNoteSchema = z.object({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	body: z.string().min(contentMinLength).max(bodyMaxLength),
})

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()
	},
} satisfies Actions
