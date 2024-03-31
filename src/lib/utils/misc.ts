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

export function safeRedirect(redirectTo: string | null, defaultPath = '/') {
	console.log(redirectTo)
	if (
		redirectTo &&
		redirectTo.startsWith('/') &&
		!redirectTo.startsWith('//')
	) {
		return redirectTo
	}
	return defaultPath
}

/*
	This function helps construct an enviro-agnostic URL. It also ensures https 
	unless we're on local and is flexible with proxies + load balancers
*/
export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ??
		request.headers.get('host') ??
		new URL(request.url).host
	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}
