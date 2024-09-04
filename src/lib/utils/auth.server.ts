import { type Password, type User } from '@prisma/client'
import { redirect, type Cookies } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import { prisma } from './db.server'
import { safeRedirect } from './misc'
import {
	authSessionCookieName,
	authSessionCookieOptions,
	getAuthSessionData,
} from '$lib/server/sessions/authSession'

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
		where: { id: sessionData.sessionId, expirationDate: { gt: new Date() } },
		select: { user: { select: { id: true } } },
	})
	if (!session?.user) {
		cookies.delete(authSessionCookieName, authSessionCookieOptions)
		return null
	}
	return session.user.id
}

export function createLoginWithRedirectUrl(
	request: Request,
	redirectTo: string | null = null,
) {
	const requestUrl = new URL(request.url)
	redirectTo =
		redirectTo === null
			? null
			: (redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`)
	const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null
	const loginRedirect = ['/login', loginParams?.toString()]
		.filter(Boolean)
		.join('?')
	return loginRedirect
}

export function requireUserId(
	userId: string | null,
	request: Request,
	redirectTo: string | null = null,
) {
	if (!userId) {
		const loginRedirect = createLoginWithRedirectUrl(request, redirectTo)
		throw redirect(303, loginRedirect)
	}
	return userId
}

// A simple function to redirect a logged in user (eg if they somehow get to login we take them back to homepage)
export function requireAnonymous(userId: string | null) {
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

export async function resetUserPassword({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const hashedPassword = await getPasswordHash(password)
	return prisma.user.update({
		where: { username },
		data: {
			password: {
				update: {
					hash: hashedPassword,
				},
			},
		},
	})
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

export async function verifyUserPassword(
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

/* 
	This func-town simply takes user info on signup and creates the user in the db
	with hashed password as well as creates a session in db for the user
*/
export async function signup({ email, username, password, name }: SignupArgs) {
	const hashedPassword = await getPasswordHash(password)
	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
			user: {
				create: {
					email: email.toLowerCase(),
					username: username.toLowerCase(),
					name,
					password: {
						create: {
							hash: hashedPassword,
						},
					},
				},
			},
		},
		select: { id: true, expirationDate: true },
	})
	return session
}

export async function getPasswordHash(password: string) {
	const hash = await bcrypt.hash(password, 10)
	return hash
}
