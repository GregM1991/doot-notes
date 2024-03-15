import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
	const { username, noteid } = params

	const note = await prisma.note.findFirst({
		select: {
			id: true,
			title: true,
			content: true,
			updatedAt: true,
			createdAt: true,
		},
		where: {
			owner: {
				username,
			},
			id: noteid,
		},
	})

	invariantResponse(note, 'Could not find note', 404)

	return { note }
}) satisfies PageServerLoad
