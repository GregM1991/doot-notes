import { env } from '$env/dynamic/private'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { EncryptedAndSignedCookieSchema } from '$lib/schemas'

const algorithm = 'aes-256-gcm'
const secret = Buffer.from(env.SESSION_SECRET ?? '')

export function encryptAndSignCookieValue<T>(
	value: T,
	signOpts?: Parameters<typeof jwt.sign>[2],
) {
	if (!secret) throw new Error('Secret key is required')
	const iv = crypto.randomBytes(16)
	const cookieValueString = objectToCookieValueString(value)
	const cipher = crypto.createCipheriv(algorithm, secret, iv)
	const encryptedCookieValueBuffer = cipher.update(cookieValueString)
	const final = cipher.final()
	const authTag = cipher.getAuthTag()
	const encryptedCookieValue = Buffer.concat([
		encryptedCookieValueBuffer,
		final,
		authTag,
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
		const authTag = encryptedBuffer.subarray(-16)
		const encryptedContent = encryptedBuffer.subarray(0, -16)
		decipher.setAuthTag(authTag)
		let decryptedVal = decipher.update(encryptedContent, undefined, 'utf8')
		decryptedVal += decipher.final('utf8')

		return cookieValueStringToObject(decryptedVal)
	} catch (error) {
		console.error(error)
		throw new Error((error as Error)?.message ?? 'Cookie decryption failed')
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
