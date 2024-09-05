import { redirect } from '@sveltejs/kit'
import { setError } from 'sveltekit-superforms'
import { type VerifyFunctionArgs } from './verify'
import { setVerificationCookieData } from '$lib/server/sessions/verifySession'
import { prisma } from '$lib/utils/db.server'
import { invariant } from '$lib/utils/misc'

export const resetPasswordUsernameSessionKey = 'resetPasswordUsername'

export async function handleVerification({
	cookies,
	form,
}: VerifyFunctionArgs) {
	invariant(form.valid, 'Form should be successful by now')
	const target = form.data.target
	const user = await prisma.user.findFirst({
		where: { OR: [{ email: target }, { username: target }] },
		select: { email: true, username: true },
	})
	// we don't want to say the user is not found if the email is not found
	// because that would allow an attacker to check if an email is registered
	if (!user) {
		return setError(form, 'code', 'Invalid code')
	}

	void setVerificationCookieData(
		resetPasswordUsernameSessionKey,
		user.username,
		cookies,
	)
	return redirect(303, '/reset-password')
}
