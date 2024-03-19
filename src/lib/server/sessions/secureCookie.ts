// TODO: encrypt and decrypt function to ensure secure cookies

import crypto from 'crypto'
import type { ToastInput } from './toastSessionStorage'
import { SESSION_SECRET } from '$env/static/private'

const algorithm = 'aes-256-cbc'
const secret = SESSION_SECRET.split(',')[0]

export function encryptAndSignCookieValue<T>(value: T) {
	const iv = crypto.randomBytes(16)
	const cookieValueString = objectToCookieValueString(value)
	const cipher = crypto.createCipheriv(algorithm, secret, iv)

	const encryptedCookieValueString = cipher.update(cookieValueString)
	const encryptedCookieValue = Buffer.concat([
		encryptedCookieValueString,
		cipher.final(),
	]).toString('hex')

	return objectToCookieValueString({
		iv: iv.toString('hex'),
		encryptedCookieValue,
	})
}

export function decryptCookie(cookieValue: string, secret: string) {
	let iv = Buffer.from(cookieValue, 'hex')
}

function objectToCookieValueString<T>(obj: T): string {
	const jsonString = JSON.stringify(obj)
	return encodeURIComponent(jsonString)
}

function cookieValueStringToObject<T>(value: string): T {
	const jsonString = decodeURIComponent(value)
	return JSON.parse(jsonString)
}

const encryptedCookie = encryptAndSignCookieValue<ToastInput>({
	description: 'blah',
	title: 'title',
	type: 'success',
})
console.log({ encryptedCookie })
