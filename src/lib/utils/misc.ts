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

/* 
	~~ Copied from https://github.com/epicweb-dev/invariant 
		 which explains better ~~
	This may look useless, but it's a simple declarative way to determine what the 
	type of something is, and to let TypeScript know it. You don't need to reach 
	for a parsing library when doing simple type checks for things that are very
	unlikely to happen, but in these situations we also don't want to just ignore
	TS, cause TS is the annoying best friend who only wants what's best for us
*/
export function invariant(
	condition: any,
	message: string | (() => string),
): asserts condition {
	if (!condition) {
		throw new InvariantError(typeof message === 'function' ? message() : message)
	}
}

export function safeRedirect(redirectTo: string | null, defaultPath = '/') {
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

class InvariantError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InvariantError'
		Object.setPrototypeOf(this, InvariantError.prototype)
	}
}