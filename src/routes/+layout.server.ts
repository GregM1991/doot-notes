import {
	getToastData,
	toastCookieName,
	toastOptionValues,
} from '$lib/server/sessions/toastSession'
import { logout } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'

export async function load({ cookies, locals }) {
	const toastCookieString = cookies.get(toastCookieName)
	const toast = toastCookieString ? getToastData(toastCookieString) : undefined
	if (toastCookieString) {
		if (toast && toast.flash) {
			cookies.delete(toastCookieName, toastOptionValues)
		}
	}

	const user = locals.userId
		? await prisma.user.findUnique({
				where: { id: locals.userId },
			})
		: null

	if (locals.userId && !user) {
		console.info('User drift')
		await logout(cookies, '/')
	}

	return { toast, user }
}
