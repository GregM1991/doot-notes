import { z } from 'zod'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions, fail, redirect } from '@sveltejs/kit'
import { parseWithZod } from '@conform-to/zod'
import { handleNewSessionWithRedirect } from '$lib/server/sessions/authSession'
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
		// TODO: Create honeypot

		const submission = await superValidate(
			request,
			zod(
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
			),
		)

		if (submission.status !== 'success' || !submission.value.session) {
			return fail(submission.status === 'error' ? 400 : 200, {
				result: submission.reply({ hideFields: ['password'] }),
			})
		}

		const { remember, session, redirectTo } = submission.value

		return handleNewSessionWithRedirect({
			cookies,
			session,
			remember: remember ?? false,
			redirectTo: redirectTo ? redirectTo : null,
		})
	},
} satisfies Actions
