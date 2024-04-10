import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import { createId as cuid } from '@paralleldrive/cuid2'
import type { Cookies } from '@sveltejs/kit'
import {
	decryptCookie,
	encryptAndSignCookieValue,
} from '$lib/server/sessions/secureCookie'

const types = ['message', 'success', 'error'] as const
export type Type = (typeof types)[number]
export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

export const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(types).default('message'),
})

// TODO: separate out name and options
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
