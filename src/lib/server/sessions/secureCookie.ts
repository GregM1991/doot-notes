// TODO: encrypt and decrypt function to ensure secure cookies

import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const algorithm = 'aes-256-cbc'
const iv = crypto.randomBytes(16)

export function encryptCookie(cookieValue: string, secret: string[]) {
	const cipher = crypto.createCipheriv(
		algorithm,
		Buffer.from(secret[0], 'hex'),
		iv,
	)

	const encryptedCookieBuffer = cipher.update(cookieValue)
	const encryptedCookie = Buffer.concat([
		encryptedCookieBuffer,
		cipher.final(),
	]).toString('hex')

	return { iv: iv.toString('hex'), encryptedCookie }
}

export function decryptCookie(cookieValue: string, secret: string) {
	let iv = Buffer.from(cookieValue, 'hex')
}