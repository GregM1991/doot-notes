import { redirect, type Cookies } from '@sveltejs/kit'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding'
import { safeRedirect } from '$lib/utils/misc'
import { z } from 'zod'
import { newEmailAddressSessionKey } from '$lib/auth/changeEmail.server'

type VerificationType =
	| typeof onboardingEmailSessionKey
	| typeof newEmailAddressSessionKey

interface HandleNewVerificationArgs {
	cookies: Cookies
	target: string
	type: VerificationType
	redirectTo: string
}

export const VerifySessionSchema = z.object({
	[onboardingEmailSessionKey]: z.string().nullable().default(null),
	[newEmailAddressSessionKey]: z.string().nullable().default(null),
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

export function getVerifySessionData(sessionCookie: string | undefined) {
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const result = VerifySessionSchema.safeParse(decryptedSessionValue)
	if (!result.success) return null
	return result.data
}
