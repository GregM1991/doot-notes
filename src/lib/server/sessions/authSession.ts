import { z } from 'zod'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { redirect, type Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'
import { sessionKey } from '$lib/utils/auth.server'
import { safeRedirect } from '$lib/utils/misc'

interface HandleNewSessionParams {
	cookies: Cookies
	session: Pick<Session, 'id' | 'userId' | 'expirationDate'>
	remember: boolean
	redirectTo: string | null
}

export const AuthSessionSchema = z.object({
	sessionId: z.string(),
})

export type Auth = z.infer<typeof AuthSessionSchema>

export const authSessionCookieName = 'dn_session'
export const authSessionCookieOptions = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
}

// TODO: Research way to create function that parses different schemas correctly (getToastData)
export function getAuthSessionData(sessionCookie: string | undefined) {
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const session = AuthSessionSchema.safeParse(decryptedSessionValue)

	return session.success ? session.data : null
}

export async function handleNewSession({
	cookies,
	session,
	remember,
	redirectTo = null,
}: HandleNewSessionParams) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[sessionKey]: session.id,
	})
	cookies.set(authSessionCookieName, encryptedCookieString, {
		...authSessionCookieOptions,
		expires: remember ? session.expirationDate : undefined,
	})

	throw redirect(303, safeRedirect(redirectTo))
}
