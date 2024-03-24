import { createId as cuid } from '@paralleldrive/cuid2'
import { z } from 'zod'

const types = ['message', 'success', 'error'] as const
export type Type = (typeof types)[number]
export type Toast = z.infer<typeof ToastSchema>
export type ToastInput = z.input<typeof ToastSchema>

const ToastSchema = z.object({
	flash: z.boolean(),
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(types).default('message'),
})

export const toastOptionValues = {
	name: 'dn_toast',
	options: {
		sameSite: 'lax' as const,
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	},
}

export function getToastData(toastCookie: string) {
	const toastValue = JSON.parse(toastCookie)
	const toast = ToastSchema.safeParse(toastValue)
	return toast.success ? toast.data : undefined
}
