import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import {
	FullNoteEditorSchema,
	MAX_UPLOAD_SIZE,
	NoteEditorSchema,
	type ImageFieldset,
} from './types'
// TODO: Delve into the wild world of file uploads
import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'

import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { parseWithZod } from '@conform-to/zod'

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
	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const form = await superValidate(formData, zod(NoteEditorSchema))
	// This is yuck-poo, but parseWithZod works out the box with form groups
	// potential TODO: come back and see if I can work a solution up
	const imageSubmission = await parseWithZod(formData, {
		schema: FullNoteEditorSchema.transform(async ({ images = [] }) => {
			return {
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
		}),
		async: true,
	})

	if (imageSubmission.status !== 'success') {
		return imageSubmission.status === 'error'
			? setError(form, '', 'Submission failed')
			: { form }
	}
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

	const transformedFormData = {
		...form.data,
		...imageSubmission.value,
	}

	const {
		id: noteId,
		title,
		content,
		imageUpdates = [],
		newImages = [],
	} = transformedFormData

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
