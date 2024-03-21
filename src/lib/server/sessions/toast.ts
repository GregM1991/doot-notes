import { SESSION_SECRET } from '$env/static/private'
import { customHandleSession } from '$lib/server/sessions/customHandleSession'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod'

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

export const toastSessionHandler = customHandleSession({
	secret: SESSION_SECRET,
	sessionName: 'dn_toast',
	cookie: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	},
})

export function redirectWithToast(
	status: sveltekitRedirectStatus,
	url: sveltekitRedirectLocation,
	toast: ToastInput,
	request: Request,
) {
	return redirect(status, url)
}
