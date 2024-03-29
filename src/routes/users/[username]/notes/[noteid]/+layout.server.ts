import type { LayoutServerLoad } from './$types'
import { invariantResponse } from '$lib/utils/misc'
import { formatDistanceToNow } from 'date-fns'
import { prisma } from '$lib/utils/db.server'

export const load = (async ({ params }) => {
	const { username, noteid } = params

	const note = await prisma.note.findFirst({
		select: {
			id: true,
			title: true,
			content: true,
			updatedAt: true,
			createdAt: true,
			owner: { select: { username: true } },
		},
		where: {
			owner: {
				username,
			},
			id: noteid,
		},
	})

	invariantResponse(note, 'Could not find note', 404)

	const date = new Date(note.updatedAt)
	const timeSinceUpdate = formatDistanceToNow(date)

	return { note, timeSinceUpdate }
}) satisfies LayoutServerLoad
