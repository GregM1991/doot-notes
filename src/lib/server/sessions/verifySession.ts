import { z } from 'zod'
import { redirect, type Cookies } from '@sveltejs/kit'
import { newEmailAddressSessionKey } from '$lib/auth/changeEmail.server'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding'
import { resetPasswordUsernameSessionKey } from '$lib/auth/resetPassword.server'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { safeRedirect } from '$lib/utils/misc'

type VerificationType =
	| typeof onboardingEmailSessionKey
	| typeof newEmailAddressSessionKey
	| typeof resetPasswordUsernameSessionKey

interface HandleNewVerificationArgs {
	cookies: Cookies
	target: string
	type: VerificationType
	redirectTo: string
}

export const VerifySessionSchema = z.object({
	[onboardingEmailSessionKey]: z.string().nullable().default(null),
	[newEmailAddressSessionKey]: z.string().nullable().default(null),
	[resetPasswordUsernameSessionKey]: z.string().nullable().default(null),
})

export const verifySessionCookieName = 'dn_verification'
export const verifySessionCookieOptions = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 60 * 10, // ten mins
}

export async function handleNewVerification({
	cookies,
	target,
	type,
	redirectTo,
}: HandleNewVerificationArgs) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[type]: target,
	})
	cookies.set(verifySessionCookieName, encryptedCookieString, {
		...verifySessionCookieOptions,
	})
	throw redirect(303, safeRedirect(redirectTo))
}

export function setVerificationCookieData(
	key: string,
	value: string,
	cookies: Cookies,
) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[key]: value,
	})
	cookies.set(verifySessionCookieName, encryptedCookieString, {
		...verifySessionCookieOptions,
	})
}

export function getVerifySessionData(cookies: Cookies) {
	const sessionCookie = cookies.get(verifySessionCookieName)
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const result = VerifySessionSchema.safeParse(decryptedSessionValue)
	if (!result.success) return null
	return result.data
}
