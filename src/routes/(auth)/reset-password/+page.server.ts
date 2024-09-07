import { redirect, type Cookies } from '@sveltejs/kit'
import { fail, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'
import {
	getVerifySessionData,
	verifySessionCookieName,
	verifySessionCookieOptions,
} from '$lib/server/sessions/verifySession.js'
import { ResetPasswordSchema } from '$lib/schemas'
import { requireAnonymous, resetUserPassword } from '$lib/utils/auth.server'

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
			return fail(400, { form })
		}
		const { password } = form.data

		await resetUserPassword({ username: resetPasswordUsername, password })
		cookies.delete(verifySessionCookieName, verifySessionCookieOptions)
		return redirect(303, '/login')
	},
}
