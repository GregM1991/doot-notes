import { fail } from '@sveltejs/kit'
import { SESSION_SECRET } from '$env/static/private'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const EncryptedAndSignedCookieSchema = z.object({
	iv: z.string().length(32),
	cookieVal: z.string(),
})

const algorithm = 'aes-256-cbc'
const secret = SESSION_SECRET.split(',')[0]

export function encryptAndSignCookieValue(
	value: unknown,
	signOpts?: Parameters<typeof jwt.sign>[2],
) {
	const iv = crypto.randomBytes(16)
	const cookieValueString = objectToCookieValueString(value)
	console.log({ cookieValueString })
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

export function decryptCookie(encryptedCookieValue: string) {
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
		if (!jwtToken.success) throw new Error('Fuck balls')

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
