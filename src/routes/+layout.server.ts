import { logout } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { honeypot } from '$lib/utils/honeypot.server'

export async function load({ cookies, locals }) {
	const user = locals.userId
		? await prisma.user.findUnique({
				where: { id: locals.userId },
				select: {
					id: true,
					email: true,
					name: true,
					createdAt: true,
					updatedAt: true,
					username: true,
					image: { select: { id: true } },
				},
			})
		: null

	if (locals.userId && !user) {
		// This is strange, but could happen if the user was deleted. Logout to be safe.
		console.info('User drift')
		await logout(cookies, '/')
	}
	const honeyProps = honeypot.getInputProps()

	return { user, honeyProps }
}
