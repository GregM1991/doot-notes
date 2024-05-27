import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { MAX_UPLOAD_SIZE, NoteEditorSchema, type ImageFieldset } from './types'

import { fail, message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

function imageHasFile(
	image: ImageFieldset,
): image is ImageFieldset & { file: NonNullable<ImageFieldset['file']> } {
	return Boolean(image.file?.size && image.file?.size > 0)
}

function imageHasId(
	image: ImageFieldset,
): image is ImageFieldset & { id: NonNullable<ImageFieldset['id']> } {
	return image.id != null
}

export const newOrUpdate: Action = async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const form = await superValidate(request, zod(NoteEditorSchema))
	if (!form.valid) return fail(400, { form })

	if (form.data.id) {
		const note = await prisma.note.findUnique({
			select: { id: true },
			where: { id: form.data.id, ownerId: userId },
		})
		if (!note) {
			return message(form, 'Note not found', { status: 404 })
		}
	}
	console.log({ formImags: form.data.images })

	let images = form.data.images ?? []

	const transformedFormData = {
		...form.data,
		imageUpdates: await Promise.all(
			images.filter(imageHasId).map(async i => {
				if (imageHasFile(i)) {
					return {
						id: i.id,
						altText: i.altText,
						contentType: i.file.type,
						blob: Buffer.from(await i.file.arrayBuffer()),
					}
				} else {
					return {
						id: i.id,
						altText: i.altText,
					}
				}
			}),
		),
		newImages: await Promise.all(
			images
				.filter(imageHasFile)
				.filter(i => !i.id)
				.map(async image => {
					return {
						altText: image.altText,
						contentType: image.file.type,
						blob: Buffer.from(await image.file.arrayBuffer()),
					}
				}),
		),
	}

	const {
		id: noteId,
		title,
		content,
		imageUpdates = [],
		newImages = [],
	} = transformedFormData
	console.log({ imageUpdates, newImages })

	const updatedNote = await prisma.note.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: noteId ?? "__this_can't_exist__" },
		create: {
			ownerId: userId,
			title,
			content,
			images: { create: newImages },
		},
		update: {
			title,
			content,
			images: {
				deleteMany: { id: { notIn: imageUpdates.map(image => image.id) } },
				updateMany: imageUpdates.map(updates => ({
					where: { id: updates.id },
					data: { ...updates, id: updates.blob ? cuid() : updates.id },
				})),
				create: newImages,
			},
		},
	})

	throw redirect(
		303,
		`/users/${updatedNote.owner.username}/notes/${updatedNote.id}`,
	)
}
