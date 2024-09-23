import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { AuthSessionSchema } from '$lib/schemas'
import type { Cookies } from '@sveltejs/kit'
import { sessionKey } from '$lib/utils/auth.server'

interface HandleNewAuthSessionParams {
	cookies: Cookies
	sessionId: string
	sessionExpiry: Date
	remember: boolean | null
}

export type Auth = z.infer<typeof AuthSessionSchema>

export const authSessionCookieName = 'dn_session'
export const authSessionCookieOptions: CookieSerializeOptions & {
	path: string
} = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
}

export function getAuthSessionData(sessionCookie: string | undefined) {
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const session = AuthSessionSchema.safeParse(decryptedSessionValue)

	return session.success ? session.data : null
}

export function handleNewAuthSession({
	cookies,
	sessionId,
	sessionExpiry,
	remember,
}: HandleNewAuthSessionParams) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[sessionKey]: sessionId,
	})
	cookies.set(authSessionCookieName, encryptedCookieString, {
		...authSessionCookieOptions,
		expires: remember ? sessionExpiry : undefined,
	})
}
