import { formatDistanceToNow } from 'date-fns'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'

export const load = async ({ params, locals }) => {
	const { noteId } = params

	const note = await prisma.note.findFirst({
		select: {
			id: true,
			title: true,
			content: true,
			updatedAt: true,
			createdAt: true,
			images: {
				select: {
					id: true,
					altText: true,
				},
			},
			owner: {
				select: {
					id: true,
				},
			},
			video: {
				select: {
					id: true,
					videoKey: true,
					thumbnailKey: true,
					fileName: true,
				},
			},
		},
		where: {
			id: noteId,
		},
	})
	invariantResponse(note, 'Could not find note', 404)

	const date = new Date(note.updatedAt)
	const timeSinceUpdate = formatDistanceToNow(date)
	const isOwner = locals.userId === note.owner.id
	const paragraphs = note.content
		.split('\n')
		.filter(para => para.trim().length > 0)
	const formattedNote = {
		...note,
		content: paragraphs,
	}

	return {
		note: formattedNote,
		timeSinceUpdate,
		isOwner,
		video: note.video,
	}
}
