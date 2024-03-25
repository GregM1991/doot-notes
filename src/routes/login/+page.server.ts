import { type Actions, fail } from '@sveltejs/kit'
import { z } from 'zod'
import type { PageServerLoad } from './$types'
import { zfd } from 'zod-form-data'
import { login } from '$lib/utils/auth.server'
import { handleNewSession } from '$lib/server/sessions/authSession'

const LoginFormSchema = zfd.formData({
	username: z.string(),
	password: z.string(),
	remember: z.boolean().optional(),
	// TODO: Add redirectTo
})

export const load = (async () => {
	console.log('Login load')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		let username = formData.get('username') ?? ''
		// TODO: Create honeypot
		const submission = LoginFormSchema.transform(async (data, ctx) => {
			const session = await login(data)
			if (!session) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Invalid username or password',
				})
				return z.NEVER
			}

			return { session, ...data }
			// return data and session
		}).safeParse(formData)

		// If submission is not successful, or there's no session
		if (!submission.success) {
			throw fail(400, {
				data: {
					error: submission.error,
					formData: { username },
				},
			})
		}

		// grab value from submission
		const { remember, session } = submission.data

		return handleNewSession({ cookies, session, remember: remember ?? false })
	},
} satisfies Actions
