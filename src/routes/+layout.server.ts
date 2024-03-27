import {
	getToastData,
	toastOptionValues,
} from '$lib/server/sessions/toastSession'
import { prisma } from '$lib/utils/db.server'

export async function load({ cookies, locals }) {
	const { name, options } = toastOptionValues

	const toastCookieString = cookies.get(name)
	const toast = toastCookieString ? getToastData(toastCookieString) : undefined
	if (toastCookieString) {
		if (toast && toast.flash) {
			cookies.delete(name, options)
		}
	}
	const user = await prisma.user.findFirst({
		select: { name: true, id: true, username: true },
		where: { id: locals.userId },
	})

	return { toast, user }
}
