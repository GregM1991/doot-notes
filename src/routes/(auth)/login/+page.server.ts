import { z } from 'zod'
import { superValidate, fail } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions, redirect } from '@sveltejs/kit'
import { login } from '$lib/utils/auth.server'
import { handleNewSessionWithRedirect } from '$lib/server/sessions/authSession'
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
	console.log('hello')
	const form = await superValidate(zod(LoginFormSchema))

	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		// TODO: Create honeypot

		const form = await superValidate(
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

		if (!form.valid || !form.data.session) {
			return fail(form.valid ? 400 : 200, {
				form: { ...form, password: '' },
			})
		}

		const { remember, session, redirectTo } = form.data

		return handleNewSessionWithRedirect({
			cookies,
			session,
			remember: remember ?? false,
			redirectTo: redirectTo ? redirectTo : null,
		})
	},
} satisfies Actions
