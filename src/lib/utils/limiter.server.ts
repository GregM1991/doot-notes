import { RetryAfterRateLimiter } from 'sveltekit-rate-limiter/server'
import { dev } from '$app/environment'
import type { RequestEvent } from '@sveltejs/kit'

const maxMultiple = !dev || process.env.PLAYWRIGHT_TEST_BASE_URL ? 10_000 : 1

export const strongRoutes = [
	'/(auth)/login',
	'/(auth)/signup',
	'/(auth)/verify',
	// '/admin',
	'/(auth)/onboarding',
	'/(auth)/reset-password',
	'/settings/profile',
]

const limiter = new RetryAfterRateLimiter({
	rates: {
		IP: [1000 * maxMultiple, 'm'],
		IPUA: [1000 * maxMultiple, 'm'],
	},
})

const strongRateLimiter = new RetryAfterRateLimiter({
	rates: {
		IP: [100 * maxMultiple, 'm'],
		IPUA: [100 * maxMultiple, 'm'],
	},
})

const strongestRateLimiter = new RetryAfterRateLimiter({
	rates: {
		IP: [1 * maxMultiple, 'm'],
		IPUA: [1 * maxMultiple, 'm'],
	},
})

function generateLimitedResponse(status: {
	limited: boolean
	retryAfter: number
}) {
	return new Response(
		`You are being rate limited. Please try after ${status.retryAfter} seconds.`,
		{
			status: 429,
			headers: { 'Retry-After': status.retryAfter.toString() },
		},
	)
}

async function strongestRateLimitCheck(event: RequestEvent) {
	const status = await strongestRateLimiter.check(event)
	if (status.limited) {
		return generateLimitedResponse(status)
	}
}

async function strongRateLimitCheck(event: RequestEvent) {
	const status = await strongRateLimiter.check(event)
	if (status.limited) {
		return generateLimitedResponse(status)
	}
}

async function generalRateLimit(event: RequestEvent) {
	const status = await limiter.check(event)
	if (status.limited) {
		return generateLimitedResponse(status)
	}
}

export async function checkRateLimit(event: RequestEvent) {
	const { request } = event
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		if (strongRoutes.some(p => event.route.id === p)) {
			await strongestRateLimitCheck(event)
		}
		await strongRateLimitCheck(event)
	}

	// the verify route is a special case because it's a GET route that
	// can have a token in the query string
	if (event.route.id === '/(auth)/verify') {
		await strongestRateLimitCheck(event)
	}

	await generalRateLimit(event)
}
