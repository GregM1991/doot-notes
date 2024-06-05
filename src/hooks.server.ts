import closeWithGrace from 'close-with-grace'
import { dev } from '$app/environment'
import { getUserId } from '$lib/utils/auth.server'
import { checkRateLimit } from '$lib/utils/limiter.server'

if (dev) {
	const { server } = await import('$msw/server.server')
	console.info('🧑‍🤝‍🧑 Mock server up and running')
	server.listen({ onUnhandledRequest: 'warn' })

	closeWithGrace(() => {
		server.close()
	})
}

export const handle = async ({ event, resolve }) => {
	await checkRateLimit(event)

	const userId = await getUserId(event.cookies)
	event.locals.userId = userId ? userId : null
	const response = await resolve(event)
	return response
}
