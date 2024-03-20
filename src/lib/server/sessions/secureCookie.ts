import { fail, type Cookies } from '@sveltejs/kit'
import { SESSION_SECRET } from '$env/static/private'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie'
import type {
	CreateCookieSessionStorageFunction,
	CookieOptions,
	GetCookie,
} from './types.secureCookies'

const EncryptedAndSignedCookieSchema = z.object({
	iv: z.string().length(32),
	cookieVal: z.string(),
})

const algorithm = 'aes-256-cbc'
const secret = SESSION_SECRET.split(',')[0]

function getSessionFromCookieString(cookieValue: string) {}

export const createCookieSessionStorage: CreateCookieSessionStorageFunction = (
	name: string,
	options?: CookieOptions,
) => {
	const cookieName = name
	async function getSession(
		getCookie: GetCookie,
		options?: CookieParseOptions,
	) {
		// I need to create a function that calls cookies.get and converts the session string value into the session object
		const cookieStringValue = getCookie(cookieName, options)
		if (!cookieStringValue) {
		}
		getSessionFromCookieString(cookieStringValue)
		console.log('Commiting session')
		// This provides the 'Set-Cookie' header for outgoing requests with changes
		// to the cookie session values
		return {
			id: 'id',
			data: {},
			has: () => true,
			get: () => undefined,
			set: () => console.log('set'),
			flash: () => console.log('set'),
			unset: () => console.log('set'),
		}
	}

	// Takes a HTTP cookie from the current request (headers.get("Cookie"))
	async function commitSession(
		cookies: Cookies,
		options?: CookieSerializeOptions,
	) {
		console.log('Reading session')
		//	this returns the session Cookie if it exists, otherwise creates a session
		return 'poops'
	}

	async function destroySession(
		cookies: Cookies,
		options?: CookieSerializeOptions,
	) {
		console.log('Destroying session')
		// This provides the 'Set-Cookie' header for outgoing requests which destroys
		// the cookie session
		return 'mcgee'
	}

	return {
		getSession,
		commitSession,
		destroySession,
	}
}

function encryptAndSignCookieValue<T>(
	value: T,
	signOpts?: Parameters<typeof jwt.sign>[2],
) {
	const iv = crypto.randomBytes(16)
	const cookieValueString = objectToCookieValueString(value)
	const cipher = crypto.createCipheriv(algorithm, secret, iv)
	const encryptedCookieValueBuffer = cipher.update(cookieValueString)
	const encryptedCookieValue = Buffer.concat([
		encryptedCookieValueBuffer,
		cipher.final(),
	]).toString('hex')
	const signedAndEncryptedCookieValue = signCookie(
		encryptedCookieValue,
		signOpts,
	)

	return objectToCookieValueString({
		iv: iv.toString('hex'),
		cookieVal: signedAndEncryptedCookieValue,
	})
}

function decryptCookie(encryptedCookieValue: string) {
	try {
		const encryptedAndSignedCookieObj =
			cookieValueStringToObject(encryptedCookieValue)

		const parsedEncryptedAndSignedCookie =
			EncryptedAndSignedCookieSchema.safeParse(encryptedAndSignedCookieObj)
		if (!parsedEncryptedAndSignedCookie.success) {
			throw new Error('Cookie parse failed')
		}
		const { iv, cookieVal } = parsedEncryptedAndSignedCookie.data
		const verified = jwt.verify(cookieVal, secret)
		const jwtToken = z.string().safeParse(verified)
		if (!jwtToken.success) throw new Error('Unable to parse jwt token')

		const ivBuffer = Buffer.from(iv, 'hex')
		const encryptedBuffer = Buffer.from(jwtToken.data, 'hex')
		const decipher = crypto.createDecipheriv(algorithm, secret, ivBuffer)
		let decryptedVal = decipher.update(encryptedBuffer, undefined, 'utf8')
		decryptedVal += decipher.final('utf8')

		return cookieValueStringToObject(decryptedVal)
	} catch (error) {
		return fail(403, { error })
	}
}

function signCookie(
	cookieValue: string,
	opts?: Parameters<typeof jwt.sign>[2],
) {
	return jwt.sign(cookieValue, secret, { ...opts })
}

function objectToCookieValueString<T>(obj: T): string {
	const jsonString = JSON.stringify(obj)
	return encodeURIComponent(jsonString)
}

function cookieValueStringToObject(value: string) {
	const jsonString = decodeURIComponent(value)
	return JSON.parse(jsonString)
}
