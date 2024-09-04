import crypto from 'crypto'
import { fail } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '$env/dynamic/private'
import { EncryptedAndSignedCookieSchema } from '$lib/schemas'

const algorithm = 'aes-256-cbc'
const secret = env.SESSION_SECRET

export function encryptAndSignCookieValue<T>(
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
	const signedAndEncryptedCookieValue = jwt.sign(
		encryptedCookieValue,
		secret,
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

function objectToCookieValueString<T>(obj: T): string {
	const jsonString = JSON.stringify(obj)
	return encodeURIComponent(jsonString)
}

function cookieValueStringToObject(value: string) {
	const jsonString = decodeURIComponent(value)
	return JSON.parse(jsonString)
}
