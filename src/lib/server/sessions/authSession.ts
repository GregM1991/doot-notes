import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { AuthSessionSchema } from '$lib/schemas'
import type { Cookies } from '@sveltejs/kit'
import type { sessionKey } from '$lib/utils/auth.server'

interface HandleNewAuthSessionParams {
	cookies: Cookies
	cookieData: {
		[sessionKey]: string
		verifiedTimeKey?: Date
		sessionExpiry: Date
	}
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

export function getAuthSessionData(cookies: Cookies) {
	const sessionCookie = cookies.get(authSessionCookieName)
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const session = AuthSessionSchema.safeParse(decryptedSessionValue)

	return session.success ? session.data : null
}

export function setNewAuthProperty<T>(cookies: Cookies, key: string, value: T) {
	const sessionData = getAuthSessionData(cookies)
	if (!sessionData) return
	const updatedSessionData = { ...sessionData, [key]: value }
	const encryptedCookieString = encryptAndSignCookieValue(updatedSessionData)
	cookies.set(authSessionCookieName, encryptedCookieString, {
		...authSessionCookieOptions,
		expires: sessionData.verifiedTimeKey,
	})
}

export function handleNewAuthSession({
	cookies,
	cookieData,
	remember,
}: HandleNewAuthSessionParams) {
	const encryptedCookieString = encryptAndSignCookieValue(cookieData)
	cookies.set(authSessionCookieName, encryptedCookieString, {
		...authSessionCookieOptions,
		expires: remember ? cookieData.sessionExpiry : undefined,
	})
}
