import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { extractImageGroup, transformImageData } from '$lib/utils/misc'
import { ImageFieldsetListSchema, NoteEditorSchema } from '$lib/schemas'
import { handleNewOrUpdateVideo } from '$lib/video/handleNewOrUpdateVideo.server'

export const newOrUpdate: Action = async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const formData = await request.formData()
	const form = await superValidate(formData, zod(NoteEditorSchema))
	if (!form.valid) return fail(400, { form })

	const images = extractImageGroup(formData)
	const imageSubmission = ImageFieldsetListSchema.safeParse(images)
	if (!imageSubmission.success)
		return setError(form, '', imageSubmission.error.formErrors.formErrors)

	const { imageUpdates = [], newImages = [] } = await transformImageData(
		imageSubmission.data,
	)

	let existingNote = null
	if (form.data.id) {
		existingNote = await prisma.note.findUnique({
			select: { id: true, video: true },
			where: { id: form.data.id, ownerId: userId },
		})
		if (!existingNote) {
			return message(form, 'Note not found', { status: 404 })
		}
	}

	const { videoData, videoId, error } = await handleNewOrUpdateVideo(
		userId,
		request,
		formData,
		existingNote?.id,
	)

	if (error) setError(form, '', error)

	const { title, content } = form.data
	let formattedContent = Array.isArray(content)
		? content.join('&#13;&#10;')
		: content

	let transactionResult
	try {
		transactionResult = await prisma.$transaction(async tx => {
			const note = await tx.note.upsert({
				select: {
					id: true,
					owner: {
						select: {
							username: true,
						},
					},
				},
				where: { id: existingNote?.id ?? cuid() },
				create: {
					ownerId: userId,
					title,
					content: formattedContent,
					images: { create: newImages },
				},
				update: {
					title,
					content: formattedContent,
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

			if (videoData) {
				if (videoId) {
					await tx.video.update({
						where: { id: videoId },
						data: videoData,
					})
				} else {
					await tx.video.create({
						data: {
							...videoData,
							noteId: note.id,
						},
					})
				}
			}

			return note
		})
	} catch (error) {
		console.error('Transaction failed:', error)
		return setError(form, '', 'Failed to save note. Please try again.')
	}

	if (transactionResult) {
		throw redirect(
			303,
			`/users/${transactionResult.owner.username}/notes/${transactionResult.id}`,
		)
	}

	return setError(form, '', 'An unexpected error occurred. Please try again.')
}
