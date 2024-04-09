import { type Password, type User } from '@prisma/client'
import { prisma } from './db.server'
import bcrypt from 'bcryptjs'
import { redirect, type Cookies } from '@sveltejs/kit'
import {
	authSessionCookieName,
	authSessionCookieOptions,
	getAuthSessionData,
} from '$lib/server/sessions/authSession'
import { safeRedirect } from './misc'

type LoginParams = {
	username: User['username']
	password: string
}
type SignupArgs = {
	email: User['email']
	username: User['username']
	password: string
	name: User['name']
}

export const sessionKey = 'sessionId'
export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

/*
	This function gives us a way to determine if the user is logged in via checking
	the authSession cookie we set when the user logs in. There are a few early exits
	(obviously if there's no authSession at all there's been no attempt at login).
*/
export async function getUserId(cookies: Cookies) {
	const sessionCookie = cookies.get(authSessionCookieName)
	const sessionData = getAuthSessionData(sessionCookie)
	if (!sessionData) return null
	const session = await prisma.session.findFirst({
		where: { id: sessionData?.sessionId, expirationDate: { gt: new Date() } },
		select: { user: { select: { id: true } } },
	})
	if (!session?.user) {
		cookies.delete(authSessionCookieName, authSessionCookieOptions)
		return null
	}
	return session.user.id
}

export function requireUserId(
	userId: string | null,
	request: Request,
	redirectTo: string | null = null,
) {
	if (!userId) {
		const requestUrl = new URL(request.url)
		redirectTo =
			redirectTo === null
				? null
				: redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`
		const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
		const loginRedirect = ['/login', loginParams?.toString()]
			.filter(Boolean)
			.join('?')
		throw redirect(303, loginRedirect)
	}
	return userId
}

// A simple function to redirect a logged in user (eg if they somehow get to login we take them back to homepage)
export async function requireAnonymous(userId: string | null) {
	if (userId) throw redirect(302, '/')
}

export async function login({ username, password }: LoginParams) {
	const user = await verifyUserPassword({ username }, password)
	if (!user) return null

	const session = await prisma.session.create({
		select: { id: true, expirationDate: true, userId: true },
		data: {
			expirationDate: getSessionExpirationDate(),
			userId: user.id,
		},
	})
	return session
}

export async function logout(cookies: Cookies, redirectTo = '/') {
	const session = getAuthSessionData(cookies.get(authSessionCookieName))
	if (session) {
		void prisma.session
			.deleteMany({ where: { id: session.sessionId } })
			.catch(() => {}) // This catch is needed to trigger a prisma promise
	}
	cookies.delete(authSessionCookieName, authSessionCookieOptions)
	redirect(303, safeRedirect(redirectTo))
}

async function verifyUserPassword(
	where: Pick<User, 'username'> | Pick<User, 'id'>,
	password: Password['hash'],
) {
	const userWithPassword = await prisma.user.findUnique({
		where,
		select: { id: true, password: { select: { hash: true } } },
	})
	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)
	if (!isValid) {
		return null
	}

	return { id: userWithPassword.id }
}

export async function signup({ email, username, password, name }: SignupArgs) {
	// Hash password
	const hashedPassword = await getPasswordHash(password)
	// Create session, use prisma query to also create user and password in db
	// select the id and expiration date and return the session
	const session = await prisma.session.create({
		data: {},
		select: { id: true, expirationDate: true },
	})
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}