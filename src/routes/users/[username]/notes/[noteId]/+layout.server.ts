import { formatDistanceToNow } from 'date-fns'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { env } from '$env/dynamic/private'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client } from '$lib/storage/r2.server'
import { error } from '@sveltejs/kit'

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
			videoKey: true,
			videoThumbnailKey: true,
			owner: {
				select: {
					id: true,
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
	let videoUrl = null
	if (note.videoKey) {
		try {
			const command = new GetObjectCommand({
				Bucket: env.R2_BUCKET_NAME,
				Key: note.videoKey,
			})

			videoUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })
		} catch (err) {
			console.error('Failed to generate video URL:', err)
			throw error(500, 'Failed to load video')
		}
	}

	return { note: formattedNote, timeSinceUpdate, isOwner, videoUrl }
}
