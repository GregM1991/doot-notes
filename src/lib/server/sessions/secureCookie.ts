import crypto from 'crypto'
import type { ToastInput } from './toastSessionStorage'
import { SESSION_SECRET } from '$env/static/private'

const algorithm = 'aes-256-cbc'
// const secret = SESSION_SECRET.split(',')[0]
const secret = '37x9T7RJfZpCBUo6hB2bxd3ZZFj67zNh'

export function encryptAndSignCookieValue(value: unknown) {
	const iv = crypto.randomBytes(16)
	const cookieValueString = objectToCookieValueString(value)
	const cipher = crypto.createCipheriv(algorithm, secret, iv)

	const encryptedCookieValueBuffer = cipher.update(cookieValueString)
	const encryptedCookieValue = Buffer.concat([
		encryptedCookieValueBuffer,
		cipher.final(),
	]).toString('hex')
	const signedandEncryptedCookie = signCookie(encryptedCookieValue)

	return objectToCookieValueString({
		iv: iv.toString('hex'),
		cookieVal: signedandEncryptedCookie,
	})
}

export function decryptCookie(cookieValue: string) {
	const parsedCookieValue = cookieValueStringToObject(cookieValue)
	console.log(parsedCookieValue)
	let iv = Buffer.from(cookieValue, 'hex')
}

function signCookie(cookieValue: string) {
	return crypto.createHmac('sha256', secret).update(cookieValue).digest('hex')
}

function objectToCookieValueString<T>(obj: T): string {
	const jsonString = JSON.stringify(obj)
	return encodeURIComponent(jsonString)
}

function cookieValueStringToObject(value: string) {
	const jsonString = decodeURIComponent(value)
	return JSON.parse(jsonString)
}

const signedAndEncryptedCookie = encryptAndSignCookieValue({
	description: 'blah',
	title: 'title',
	type: 'success',
})
console.log({ signedAndEncryptedCookie })
console.log(
	'~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
)
const decryptedCookie = decryptCookie(signedAndEncryptedCookie)
console.log({ decryptedCookie })
