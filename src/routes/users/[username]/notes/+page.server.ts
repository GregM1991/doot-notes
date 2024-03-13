import { prisma } from '$lib/utils/db.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ parent }) => {
	const { user } = await parent()
	const userNotes = await prisma.note.findMany({
		select: { id: true, title: true },
		where: {
			ownerId: user.id,
		},
	})

	return { notes: userNotes }
}) satisfies PageServerLoad
