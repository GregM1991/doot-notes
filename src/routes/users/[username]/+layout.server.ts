import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc.js'

export const load = async ({ params }) => {
	const owner = await prisma.user.findFirst({
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

	invariantResponse(owner, 'User not found', 404)

	return { owner, userJoinedDisplay: owner.createdAt.toLocaleDateString() }
}
