import { redirect, type Cookies } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { requireAnonymous, resetUserPassword } from '$lib/utils/auth.server'
import {
	getVerifySessionData,
	verifySessionCookieName,
	verifySessionCookieOptions,
} from '$lib/server/sessions/verifySession.js'
import { PasswordAndConfirmPasswordSchema } from '$lib/schemas'

const ResetPasswordSchema = PasswordAndConfirmPasswordSchema

function requireResetPasswordUsername(userId: string | null, cookies: Cookies) {
	requireAnonymous(userId)
	const verifySession = getVerifySessionData(cookies)
	const resetPasswordUsername = verifySession?.resetPasswordUsername
	if (typeof resetPasswordUsername !== 'string' || !resetPasswordUsername) {
		throw redirect(303, '/login')
	}
	return resetPasswordUsername
}

export const load = (async ({ locals, cookies }) => {
	const resetPasswordUsername = requireResetPasswordUsername(
		locals.userId,
		cookies,
	)
	const resetPasswordForm = await superValidate(zod(ResetPasswordSchema))

	return { resetPasswordForm, resetPasswordUsername }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, cookies, locals }) => {
		const resetPasswordUsername = requireResetPasswordUsername(
			locals.userId,
			cookies,
		)
		const form = await superValidate(request, zod(ResetPasswordSchema))
		if (!form.valid) {
			return { form }
		}
		const { password } = form.data

		await resetUserPassword({ username: resetPasswordUsername, password })
		cookies.delete(verifySessionCookieName, verifySessionCookieOptions)
		return redirect(303, '/login')
	},
}
