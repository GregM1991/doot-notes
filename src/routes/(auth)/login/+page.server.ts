import { z } from 'zod'
import { type Actions, fail, redirect } from '@sveltejs/kit'
import { parseWithZod } from '@conform-to/zod'
import { handleNewSession } from '$lib/server/sessions/authSession'
import { login } from '$lib/utils/auth.server'
// import { formatFormErrors } from '$lib/utils/misc'
import { PasswordSchema, UsernameSchema } from '$lib/utils/userValidation'
import type { PageServerLoad } from './$types'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember: z.boolean().optional(),
	redirectTo: z.string().optional(),
})

export const load = (async ({ locals }) => {
	if (locals.userId) throw redirect(303, '/')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		// TODO: Create honeypot

		const submission = await parseWithZod(formData, {
			schema: intent =>
				LoginFormSchema.transform(async (data, ctx) => {
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
				}),
			async: true,
		})

		if (submission.status !== 'success' || !submission.value.session) {
			return fail(submission.status === 'error' ? 400 : 200, {
				result: submission.reply({ hideFields: ['password'] }),
			})
		}

		const { remember, session, redirectTo } = submission.value

		return handleNewSession({
			cookies,
			session,
			remember: remember ?? false,
			redirectTo: redirectTo ? redirectTo : null,
		})
	},
} satisfies Actions
