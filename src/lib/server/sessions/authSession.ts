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
	const decryptedToastValue = decryptCookie(sessionCookie)
	const parsedToast = JSON.parse(decryptedToastValue)
	const session = AuthSchema.safeParse(parsedToast)

	return session.success ? session.data : undefined
}

function getOrSetSessionCookie(cookies: Cookies) {
	const cookieSessionString = cookies.get(authOptionValues.name)
	if (cookieSessionString) {
		return cookieSessionString
	}
	cookies.set(authOptionValues.name, '', authOptionValues.options)
	return ''
}

export async function handleNewSession({
	cookies,
	session,
	remember,
}: HandleNewSessionParams) {
	// Get session from cookie
	const cookieSessionString = getOrSetSessionCookie(cookies)
	// Set the sessionKey to session.id
	const cookieSession = getSessionData(cookieSessionString) ?? {}
	const encryptedCookieString = encryptAndSignCookieValue({
		...cookieSession,
		[sessionKey]: session.id,
	})
	// set cookie with new val
	cookies.set(
		authOptionValues.name,
		encryptedCookieString,
		authOptionValues.options,
	)
	// redirect to home for now
	throw redirect(303, '/')
}
