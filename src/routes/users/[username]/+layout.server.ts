import { prisma } from '$lib/utils/db.server'
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

	if (!user) {
		error(404, 'User not found')
	}

	return { user, userJoinedDisplay: user.createdAt.toLocaleDateString() }
}
