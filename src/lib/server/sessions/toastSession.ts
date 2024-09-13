import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import type { Cookies } from '@sveltejs/kit'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'
import { ToastSchema, toastTypes } from '$lib/schemas'

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

	return toast.success ? toast.data : null
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
