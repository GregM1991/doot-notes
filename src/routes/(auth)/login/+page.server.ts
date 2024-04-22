import { z } from 'zod'
import { superValidate, message, fail } from 'sveltekit-superforms'
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
	const form = await superValidate(zod(LoginFormSchema))

	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		// TODO: Create honeypot

		const form = await superValidate(request, zod(LoginFormSchema))
		if (!form.valid)
			return fail(400, { ...form, data: { ...form.data, password: '' } })

		const session = await login(form.data)
		if (!session) {
			return message(
				{ ...form, data: { ...form.data, password: '' } },
				'Invalid username or password',
				{ status: 400 },
			)
		}

		const { remember, redirectTo } = form.data

		return handleNewSessionWithRedirect({
			cookies,
			session,
			remember: remember ?? false,
			redirectTo: redirectTo ? redirectTo : null,
		})
	},
} satisfies Actions
