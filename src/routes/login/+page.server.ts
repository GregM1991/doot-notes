import { type Actions, fail } from '@sveltejs/kit'
import { z } from 'zod'
import type { PageServerLoad } from './$types'
import { zfd } from 'zod-form-data'
import { login } from '$lib/utils/auth.server'
import { handleNewSession } from '$lib/server/sessions/authSession'
import { PasswordSchema, UsernameSchema } from '$lib/utils/userValidation'

const LoginFormSchema = zfd.formData({
	username: UsernameSchema,
	password: PasswordSchema,
	remember: z.boolean().optional(),
	// TODO: Add redirectTo
})

export const load = (async () => {
	console.log('Login load')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		let username = formData.get('username')?.toString() ?? ''
		// TODO: Create honeypot
		const submission = await LoginFormSchema.transform(async (data, ctx) => {
			const session = await login(data)
			if (!session) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Invalid username or password',
				})
				return z.NEVER
			}

			return {
				session,
				...data,
			}
			// return data and session
		}).safeParseAsync(formData)

		// If submission is not successful, or there's no session
		if (!submission.success) {
			console.log(
				JSON.stringify(Object.entries(submission.error.flatten().fieldErrors)),
			)
			return fail(400, {
				data: {
					errors: {
						formErrors: submission.error.message,
						fieldErrors: submission.error.flatten().fieldErrors.entries,
					},
					formData: { username },
				},
			})
		}

		// grab value from submission
		const { remember, session } = submission.data

		return handleNewSession({ cookies, session, remember: remember ?? false })
	},
} satisfies Actions
