import { superValidate, setError, fail } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions, redirect } from '@sveltejs/kit'
import { login } from '$lib/utils/auth.server'
import type { PageServerLoad } from './$types'
import { checkHoneypot } from '$lib/utils/honeypot.server'
import { LoginFormSchema } from '$lib/schemas'
import { handleNewSession } from '$lib/auth/login.server'

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
			return fail(400, {
				form: { ...form, data: { ...form.data, password: '' } },
			})
		checkHoneypot(formData, form)

		const session = await login(form.data)
		if (!session) {
			return setError(
				{ ...form, data: { ...form.data, password: '' } },
				'',
				'Invalid username or password',
			)
		}

		const { remember, redirectTo } = form.data

		return handleNewSession({
			request,
			cookies,
			session,
			remember: remember ?? false,
			redirectTo: redirectTo ? redirectTo : undefined,
		})
	},
} satisfies Actions
