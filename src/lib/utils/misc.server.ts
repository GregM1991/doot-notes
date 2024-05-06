import { redirect } from '@sveltejs/kit'
import { prisma } from './db.server'

export async function requirePassword(userId: string) {
	const password = await prisma.password.findUnique({
		select: { userId: true },
		where: { userId },
	})
	if (!password) {
		throw redirect(302, '/settings/profile/password/create')
	}
}
