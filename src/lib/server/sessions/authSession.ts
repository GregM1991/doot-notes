import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import { redirect, type Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { sessionKey } from '$lib/utils/auth.server'
import { safeRedirect } from '$lib/utils/misc'

type SessionType = {
	id: Session['id']
	userId?: Session['userId']
	expirationDate?: Session['expirationDate']
}

interface HandleNewSessionParams {
	cookies: Cookies
	session: SessionType
	remember: boolean | null
}

export const AuthSessionSchema = z.object({
	sessionId: z.string(),
})

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

// TODO: Research way to create function that parses different schemas correctly (getToastData)
export function getAuthSessionData(sessionCookie: string | undefined) {
	if (!sessionCookie) return null
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const session = AuthSessionSchema.safeParse(decryptedSessionValue)

	return session.success ? session.data : null
}

export async function handleNewSessionWithRedirect({
	cookies,
	session,
	remember,
	redirectTo = null,
}: HandleNewSessionParams & { redirectTo: string | null }) {
	handleNewSession({ cookies, session, remember })
	throw redirect(303, safeRedirect(redirectTo))
}

export function handleNewSession({
	cookies,
	session,
	remember,
}: HandleNewSessionParams) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[sessionKey]: session.id,
	})
	cookies.set(authSessionCookieName, encryptedCookieString, {
		...authSessionCookieOptions,
		expires: remember ? session.expirationDate : undefined,
	})
}
