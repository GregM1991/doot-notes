import closeWithGrace from 'close-with-grace'
import { dev, building } from '$app/environment'
import { getUserId } from '$lib/utils/auth.server'
import { getEnv, init } from '$lib/utils/env.server'

init()
getEnv()

if (dev) {
	const { server } = await import('$msw/server.server')
	console.info('🧑‍🤝‍🧑 Mock server up and running')
	server.listen({ onUnhandledRequest: 'warn' })

	closeWithGrace(() => {
		server.close()
	})
}
export const handle = async ({ event, resolve }) => {
	const userId = await getUserId(event.cookies)
	event.locals.userId = userId ? userId : null
	return resolve(event)
}
