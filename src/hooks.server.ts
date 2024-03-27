import {
	authOptionValues,
	getSessionData,
} from '$lib/server/sessions/authSession'
import { prisma } from '$lib/utils/db.server'

export const handle = async ({ resolve, event }) => {
	const sessionCookie = event.cookies.get(authOptionValues.name)
	if (sessionCookie) {
		const sessionData = getSessionData(sessionCookie)
		const session = await prisma.session.findFirst({
			where: { id: sessionData?.sessionId, expirationDate: { gt: new Date() } },
			select: { user: { select: { id: true } } },
		})
		if (!session?.user) {
			event.cookies.delete(authOptionValues.name, authOptionValues.options)
			return resolve(event)
		}
		event.locals.userId = session.user.id
	}
	return resolve(event)
}
