import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { formatDistanceToNow } from 'date-fns'
import type { Actions, PageServerLoad } from './$types'

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

	const date = new Date(note.updatedAt)
	const timeSinceUpdate = formatDistanceToNow(date)

	return { note, timeSinceUpdate }
}) satisfies PageServerLoad

export const actions = {
	edit: async () => {
		console.log('edit')
	},
	delete: async () => {
		console.log('delete')
	},
} satisfies Actions