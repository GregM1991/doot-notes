import { type LayoutServerLoad } from './$types'
import { prisma } from '$lib/utils/db.server'

export const load = (async ({ parent }) => {
	const { owner } = await parent()
	const ownerNotes = await prisma.note.findMany({
		select: { id: true, title: true },
		where: {
			ownerId: owner.id,
		},
	})

	return { notes: ownerNotes, owner: { name: owner.name, id: owner.id } }
}) satisfies LayoutServerLoad
