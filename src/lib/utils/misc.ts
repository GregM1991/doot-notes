import { error } from '@sveltejs/kit'

export function debounce<
	Callback extends (...args: Parameters<Callback>) => void,
>(fn: Callback, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}

export function invariantResponse(
	condition: any,
	message: string | (() => string),
	status: number = 400,
): asserts condition {
	if (!condition) {
		error(status, typeof message === 'function' ? message() : message)
	}
}
