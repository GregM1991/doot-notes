import type { Handle } from '@sveltejs/kit'
import type { SessionOptions } from 'svelte-kit-cookie-session'
import { CookieSession } from 'svelte-kit-cookie-session/core'

export function customHandleSession(
	options: SessionOptions & { sessionName: string },
	passedHandle: Handle = async ({ event, resolve }) => resolve(event),
): Handle {
	return async function handle({ event, resolve }) {
		const session = new CookieSession(event, options)
		await session.init()
		;(event.locals as any)[options.sessionName] = session

		const response = await passedHandle({ event, resolve })

		if (session.needsSync) {
			response.headers.set('x-svelte-kit-cookie-session-needs-sync', '1')
		}

		return response
	}
}
