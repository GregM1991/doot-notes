import {
	authSessionCookieOptions,
	authSessionCookieName,
	getSessionData,
} from '$lib/server/sessions/authSession'
import { prisma } from '$lib/utils/db.server'

export const handle = async ({ resolve, event }) => {
	const sessionData = getSessionData(event.cookies.get(authSessionCookieName))
	if (sessionData) {
		const session = await prisma.session.findFirst({
			where: { id: sessionData?.sessionId, expirationDate: { gt: new Date() } },
			select: { user: { select: { id: true } } },
		})
		if (!session?.user) {
			event.cookies.delete(authSessionCookieName, authSessionCookieOptions)
			return resolve(event)
		}
		event.locals.userId = session.user.id
	}
	event.locals.userId = null
	return resolve(event)
}
