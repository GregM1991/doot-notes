import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc.js'
import { error } from '@sveltejs/kit'

export const load = async ({ params }) => {
	const user = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			createdAt: true,
			image: { select: { id: true } },
		},
		where: {
			username: params.username,
		},
	})

	invariantResponse(user, 'User not found', 404)

	return { user, userJoinedDisplay: user.createdAt.toLocaleDateString() }
}
