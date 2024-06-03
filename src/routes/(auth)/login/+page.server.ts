import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { type Actions, redirect } from '@sveltejs/kit'
import { handleNewSessionWithRedirect } from '$lib/server/sessions/authSession'
import { PasswordSchema, UsernameSchema } from '$lib/utils/userValidation'
import { login } from '$lib/utils/auth.server'
import type { PageServerLoad } from './$types'
import { checkHoneypot } from '$lib/utils/honeypot.server'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember: z.boolean().optional(),
	redirectTo: z.string().optional(),
})

export const load = (async ({ locals }) => {
	if (locals.userId) throw redirect(303, '/')
	const loginForm = await superValidate(zod(LoginFormSchema))

	return { loginForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const form = await superValidate(formData, zod(LoginFormSchema))
		if (!form.valid)
			return { form: { ...form, data: { ...form.data, password: '' } } }
		checkHoneypot(formData, form)

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
