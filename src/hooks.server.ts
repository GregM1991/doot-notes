import closeWithGrace from 'close-with-grace'
import { getUserId } from '$lib/utils/auth.server'
import { checkRateLimit } from '$lib/utils/limiter.server'
import { dev } from '$app/environment'

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
	// await new Promise(fulfil => setTimeout(fulfil, 2000)) //TODO: remove
	const userId = await getUserId(event.cookies)
	event.locals.userId = userId ? userId : null
	const response = await resolve(event)
	return response
}
