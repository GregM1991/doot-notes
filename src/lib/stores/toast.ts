import { writable } from 'svelte/store'
import { createId as cuid } from '@paralleldrive/cuid2'

const types = ['message', 'success', 'error'] as const
export type Type = (typeof types)[number]
export type Toast = {
	description: string
	id: string
	title?: string
	type: Type
}
export type ToastInput = {
	description: string
	title?: string
	type?: Type
	id?: string
}

const defaultTimeout = 5000
export const toasts = writable(new Array<Toast>())

export function setToast({
	title,
	description,
	type = 'message',
	id = cuid(),
}: ToastInput) {
	const toast = {
		title,
		description,
		type,
		id,
	}
	toasts.update(all => [toast, ...all])
	setTimeout(() => dismissToast(id), defaultTimeout)
}

export function dismissToast(id: string) {
	toasts.update(all => all.filter(t => t.id !== id))
}
