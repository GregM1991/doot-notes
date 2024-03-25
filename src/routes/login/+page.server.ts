import { redirect, type Actions, fail } from '@sveltejs/kit'
import { prisma } from '$lib/utils/db.server'
import { z } from 'zod'
import type { PageServerLoad } from './$types'
import { zfd } from 'zod-form-data'
import { login } from '$lib/utils/auth.server'

const LoginFormSchema = zfd.formData({
	username: z.string(),
	password: z.string(),
})

export const load = (async () => {
	console.log('Login load')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		// TODO: Create honeypot
		const submission = LoginFormSchema.transform(async (data, ctx) => {
			const session = await login(data)
			// If no session return z.NEVER with custom code and Invalid username and password

			// return data and session
		}).safeParse(formData)
		// TODO: Create session in parse

		// If submission is not successful, or there's no session
		if (!submission.success) {
			throw fail(400, { data: { error: 'Invalid username or password' } })
		}

		// grab value from submission

		// handleNewSession() { request, session, remember, redirectTo }
	},
} satisfies Actions
