import z from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { createId as cuid } from '@paralleldrive/cuid2'
import { fail, redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { MAX_UPLOAD_SIZE, NoteEditorSchema, type ImageFieldset } from './types'
import {
	unstable_createMemoryUploadHandler as createMemoryUploadHandler,
	unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node'
import { message, superValidate } from 'sveltekit-superforms'
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

	const formData = await parseMultipartFormData(
		request,
		createMemoryUploadHandler({ maxPartSize: MAX_UPLOAD_SIZE }),
	)
	const form = await superValidate(formData, zod(NoteEditorSchema))
	if (form.id) {
		const note = await prisma.note.findUnique({
			select: { id: true },
			where: { id: form.id, ownerId: userId },
		})
		if (!note) {
			return message(form, 'Note not found', { status: 404 })
		}
	}

	// .superRefine(async (data, ctx) => {
	// 	if (!data.id) return

	// transform(async ({ images = [], ...data }) => {
	// 	return {
	// 		...data,
	// 		imageUpdates: await Promise.all(
	// 			images.filter(imageHasId).map(async image => {
	// 				if (imageHasFile(image)) {
	// 					return {
	// 						id: image.id,
	// 						altText: image.altText,
	// 						contentType: image.file.type,
	// 						blob: Buffer.from(await image.file?.arrayBuffer()),
	// 					}
	// 				} else {
	// 					return {
	// 						id: image.id,
	// 						altText: image.altText,
	// 					}
	// 				}
	// 			}),
	// 		),
	// 		newImages: await Promise.all(
	// 			images
	// 				.filter(imageHasFile)
	// 				.filter(image => !image.id)
	// 				.map(async image => {
	// 					return {
	// 						altText: image.altText,
	// 						contentType: image.file.type,
	// 						blob: Buffer.from(await image.file?.arrayBuffer()),
	// 					}
	// 				}),
	// 		),
	// 	}
	// }),
	console.log(form)

	// PICK-UP: swapping over to superforms
	if (!form.valid) {
		return fail(submission.status === 'error' ? 400 : 200, {
			result: submission.reply(),
		})
	}

	// const {
	// 	id: noteId,
	// 	title,
	// 	content,
	// 	imageUpdates = [],
	// 	newImages = [],
	// } = submission.value
	// console.log({
	// 	imageUpdates,
	// 	newImages,
	// })

	// const updatedNote = await prisma.note.upsert({
	// 	select: { id: true, owner: { select: { username: true } } },
	// 	where: { id: noteId ?? "__this_can't_exist__" },
	// 	create: {
	// 		ownerId: userId,
	// 		title,
	// 		content,
	// 		images: { create: newImages },
	// 	},
	// 	update: {
	// 		title,
	// 		content,
	// 		images: {
	// 			deleteMany: { id: { notIn: imageUpdates.map(image => image.id) } },
	// 			updateMany: imageUpdates.map(updates => ({
	// 				where: { id: updates.id },
	// 				data: { ...updates, id: updates.blob ? cuid() : updates.id },
	// 			})),
	// 			create: newImages,
	// 		},
	// 	},
	// })

	// throw redirect(
	// 	303,
	// 	`/users/${updatedNote.owner.username}/notes/${updatedNote.id}`,
	// )
}
