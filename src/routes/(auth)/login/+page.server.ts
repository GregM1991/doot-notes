import { type Actions, fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'
import { login } from '$lib/utils/auth.server'
import { handleNewSession } from '$lib/server/sessions/authSession'
import { PasswordSchema, UsernameSchema } from '$lib/utils/userValidation'
import type { PageServerLoad } from './$types'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember: z.boolean().optional(),
	// TODO: Add redirectTo
})

export const load = (async ({ locals }) => {
	if (locals.userId) throw redirect(303, '/')
	console.log('Login load')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const data = {
			username: formData.get('username'),
			password: formData.get('password'),
		}
		console.log(data, typeof data.username, typeof data.password)
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
		}).safeParseAsync(formData)

		if (!submission.success) {
			console.log(submission.error)
			const { formErrors, fieldErrors } = submission.error.flatten()
			console.log({ formErrors, fieldErrors })
			return fail(400, {
				data: {
					errors: {
						formErrors: formErrors.map(error => {
							console.log(error)
							return ''
						}),
						fieldErrors,
					},
					formData: { username },
				},
			})
		}

		const { remember, session } = submission.data

		return handleNewSession({ cookies, session, remember: remember ?? false })
	},
} satisfies Actions
