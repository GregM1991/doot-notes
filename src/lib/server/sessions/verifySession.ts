import type { Verification } from '@prisma/client'
import { redirect, type Cookies } from '@sveltejs/kit'
import { encryptAndSignCookieValue } from './secureCookie'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding.server'
import { safeRedirect } from '$lib/utils/misc'

interface HandleNewVerificationArgs {
	cookies: Cookies
	target: string
	redirectTo?: string | null
}

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
	redirectTo = null,
}: HandleNewVerificationArgs) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[onboardingEmailSessionKey]: target,
	})
	cookies.set(verifySessionCookieName, encryptedCookieString, {
		...verifySessionCookieOptions,
	})

	throw redirect(303, safeRedirect(redirectTo))
}
