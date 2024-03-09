export function debounce<
	Callback extends (...args: Parameters<Callback>) => void,
>(fn: Callback, delay: number) {
	let timer: ReturnType<typeof setTimeout> | null = null
	console.log('hello?')
	return (...args: Parameters<Callback>) => {
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			fn(...args)
		}, delay)
	}
}
