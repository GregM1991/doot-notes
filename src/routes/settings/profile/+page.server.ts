import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import type { PageServerLoad } from './$types'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { username: true },
	})
	invariantResponse(user, 'User not found', 404)
	return {}
}) satisfies PageServerLoad
