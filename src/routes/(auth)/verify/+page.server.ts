import { type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { validateRequest } from '$lib/auth/verify.server'
import { VerifySchema } from '$lib/schemas'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	const verifyForm = await superValidate(url.searchParams, zod(VerifySchema), {
		errors: false,
	})
	return { verifyForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ cookies, request, locals }) => {
		const formData = await request.formData()
		return validateRequest(cookies, request, formData, locals?.userId)
	},
} satisfies Actions
