import { fail, type Cookies } from '@sveltejs/kit'
import { SESSION_SECRET } from '$env/static/private'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie'
import type {
	CreateCookieSessionStorageFunction,
	CookieOptions,
} from './types.secureCookies'
import { createId } from '@paralleldrive/cuid2'

const defaultCookieOptions = {
	name: '__session',
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax' as const,
}

const EncryptedAndSignedCookieSchema = z.object({
	iv: z.string().length(32),
	cookieVal: z.string(),
})

const algorithm = 'aes-256-cbc'
const secret = SESSION_SECRET.split(',')[0]
const flashPrefix = '__flash'

export const createCookieSessionStorage: CreateCookieSessionStorageFunction =
	async (cookie: CookieOptions) => {
		const cookieOptions = { ...defaultCookieOptions, ...cookie }
		const id = createId()

		async function getSession(cookies: Cookies, options?: CookieParseOptions) {
			let data = undefined
			const cookieValueString = cookies.get(cookieOptions.name, options)
			if (!cookieValueString) {
				const stringValue = objectToCookieValueString({ hello: 'poops mcgee' })
				cookies.set(cookieOptions.name, stringValue, cookieOptions)
				return undefined
			}

			const sessionObject = cookieValueStringToObject(cookieValueString)

			function has(name: string) {
				return Object.hasOwn(sessionObject, name)
			}

			function get(name: string) {
				const value = sessionObject[name] ?? undefined
				return value
			}

			function set(name: string, value: any) {
				sessionObject[name] = value
			}

			function flash(name: string, value: any) {
				const flashName = `${flashPrefix}${name}`
				sessionObject[flashName] = value
			}

			function unset(name: string) {
				delete sessionObject[name]
			}
			// This provides the 'Set-Cookie' header for outgoing requests with changes
			// to the cookie session values
			return {
				id,
				data,
				has,
				get,
				set,
				flash,
				unset,
			}
		}

		// Takes a HTTP cookie from the current request (headers.get("Cookie"))
		async function commitSession(
			cookies: Cookies,
			options?: CookieSerializeOptions,
		) {
			console.log('Committing session')
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
