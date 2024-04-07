import closeWithGrace from 'close-with-grace'
import {
	authSessionCookieOptions,
	authSessionCookieName,
	getSessionData,
} from '$lib/server/sessions/authSession'
import { prisma } from '$lib/utils/db.server'
import { dev } from '$app/environment'

if (dev) {
	const { server } = await import('$msw/server.server')
	console.info('🧑‍🤝‍🧑 Mock server up and running')
	server.listen({ onUnhandledRequest: 'warn' })

	closeWithGrace(() => {
		server.close()
	})
}
export const handle = async ({ resolve, event }) => {
	const { cookies, locals } = event
	const userId = getUserId(cookies.get(authSessionCookieName)) // Replace below code with this
	const sessionData = getSessionData(cookies.get(authSessionCookieName))
	if (sessionData) {
		const session = await prisma.session.findFirst({
			where: { id: sessionData?.sessionId, expirationDate: { gt: new Date() } },
			select: { user: { select: { id: true } } },
		})
		if (!session?.user) {
			cookies.delete(authSessionCookieName, authSessionCookieOptions)
			return resolve(event)
		}
		locals.userId = session.user.id
		return resolve(event)
	}
	locals.userId = null
	return resolve(event)
}

