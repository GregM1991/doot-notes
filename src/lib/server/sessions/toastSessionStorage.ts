import { createId as cuid } from '@paralleldrive/cuid2'
import { dev } from '$app/environment'
import type { CookieSerializeOptions } from 'cookie'
import { z } from 'zod'
import { redirect, type Cookies } from '@sveltejs/kit'

interface ICookieSession {
	name: string
	options: CookieSerializeOptions & { path: string }
}

type sveltekitRedirectStatus = Parameters<typeof redirect>[0]
type sveltekitRedirectLocation = Parameters<typeof redirect>[1]
export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(['message', 'success', 'error']).default('message'),
})

export const toastSessionStorage: ICookieSession = {
	name: 'dn_toast',
	options: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: dev,
	},
}

export function redirectWithToast(
	status: sveltekitRedirectStatus,
	url: sveltekitRedirectLocation,
	toast: ToastInput,
	cookies: Cookies,
) {
	return redirect(status, url)
}
