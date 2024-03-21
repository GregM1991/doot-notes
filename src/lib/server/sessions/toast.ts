import { createId as cuid } from '@paralleldrive/cuid2'
import { SESSION_SECRET } from '$env/static/private'
import { customHandleSession } from '$lib/server/sessions/customHandleSession'
import { z } from 'zod'

const types = ['message', 'success', 'error'] as const
export type Type = (typeof types)[number]
export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(types).default('message'),
})

// TODO: Figure out how to expire flash cookies? 
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
