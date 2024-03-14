import { prisma } from '$lib/utils/db.server'
import type { LayoutServerLoad } from './$types'

export const load = (async ({ parent }) => {
	const { user } = await parent()
	const userNotes = await prisma.note.findMany({
		select: { id: true, title: true },
		where: {
			ownerId: user.id,
		},
	})

	return { notes: userNotes, user: { name: user.name, id: user.id } }
}) satisfies LayoutServerLoad
