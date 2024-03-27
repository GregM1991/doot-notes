import { z } from 'zod'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { redirect, type Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'
import { sessionKey } from '$lib/utils/auth.server'

interface HandleNewSessionParams {
	cookies: Cookies
	session: Pick<Session, 'id' | 'userId' | 'expirationDate'>
	remember: boolean
}

export const AuthSchema = z.object({
	sessionId: z.string(),
})

export type Auth = z.infer<typeof AuthSchema>

export const authOptionValues = {
	name: 'dn_session',
	options: {
		sameSite: 'lax' as const,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	},
}

// TODO: Research way to create function that parses different schemas correctly (getToastData)
export function getSessionData(sessionCookie: string) {
	const decryptedSessionValue = decryptCookie(sessionCookie)
	const session = AuthSchema.safeParse(decryptedSessionValue)

	return session.success ? session.data : undefined
}

export async function handleNewSession({
	cookies,
	session,
	remember,
}: HandleNewSessionParams) {
	const encryptedCookieString = encryptAndSignCookieValue({
		[sessionKey]: session.id,
	})
	cookies.set(authOptionValues.name, encryptedCookieString, {
		...authOptionValues.options,
		expires: remember ? session.expirationDate : undefined,
	})

	throw redirect(303, '/')
}
