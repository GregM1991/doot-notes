import { type Cookies } from '@sveltejs/kit'
import { type CookieSerializeOptions } from 'cookie'
import { type z } from 'zod'
import { ToastSchema, type toastTypes } from '$lib/schemas'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'

export type Type = (typeof toastTypes)[number]
export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

export const toastCookieName = 'dn_toast'
export const toastOptionValues: CookieSerializeOptions & {
	path: string
} = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 10,
}

export function getToastData(toastCookie: string) {
	const decryptedToastValue = decryptCookie(toastCookie)
	const parsedToast = JSON.parse(decryptedToastValue)
	const toast = ToastSchema.safeParse(parsedToast)

	return toast.success ? toast.data : undefined
}

export function setToastDataToCookie(
	cookies: Cookies,
	{ title, description, type }: ToastInput,
) {
	const toastValue = JSON.stringify({
		title,
		description,
		type,
	})
	const encryptedToastValue = encryptAndSignCookieValue(toastValue)
	cookies.set(toastCookieName, encryptedToastValue, toastOptionValues)
}
