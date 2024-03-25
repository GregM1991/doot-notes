import { z } from 'zod'
import { decryptCookie } from '$lib/server/sessions/secureCookie'
import type { Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'

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
export function getSessionData(toastCookie: string) {
	const decryptedToastValue = decryptCookie(toastCookie)
	const parsedToast = JSON.parse(decryptedToastValue)
	const toast = AuthSchema.safeParse(parsedToast)

	return toast.success ? toast.data : undefined
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
	const cookieSession = getSessionData(cookieSessionString)
	// set cookie with new val
	// redirect to home for now
}
