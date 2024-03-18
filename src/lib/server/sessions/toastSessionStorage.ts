import { createId as cuid } from '@paralleldrive/cuid2'
import { dev } from '$app/environment'
import type { CookieSerializeOptions } from 'cookie'
import { SESSION_SECRET } from '$env/static/private'
import { z } from 'zod'
import { redirect, type Cookies } from '@sveltejs/kit'

interface ICookieSession {
	name: string
	options: CookieSerializeOptions & {
		path?: string
	}
	secrets?: string[]
}

const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(['message', 'success', 'error']).default('message'),
})

export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

export const toastSessionStorage: ICookieSession = {
	name: 'dn_toast',
	options: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: dev,
	},
	secrets: SESSION_SECRET.split(','),
}

export function redirectWithToast(
	url: string,
	toast: ToastInput,
	cookies: Cookies,
) {
	const { name, options, secrets } = toastSessionStorage

	return redirect(url)
}
