import { validateRequest } from '$lib/auth/verify.server'
import { type Actions } from '@sveltejs/kit'

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData()
		// TODO: check honeypot
		return validateRequest(cookies, request, formData)
	},
} satisfies Actions
