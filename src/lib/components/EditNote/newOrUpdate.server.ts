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
	if (form.data.id) {
		const note = await prisma.note.findUnique({
			select: { id: true },
			where: { id: form.data.id, ownerId: userId },
		})
		if (!note) {
			return message(form, 'Note not found', { status: 404 })
		}
	}

	const { videoData, videoId, error } = await handleNewOrUpdateVideo(
		userId,
		request,
		formData,
	)

	if (error) setError(form, '', error)

	const transformedFormData = {
		...form.data,
	}
	const { id: noteId, title, content } = transformedFormData
	let formattedContent = content
	if (Array.isArray(content)) {
		formattedContent = content.join('&#13;&#10;')
	}

	const updatedNote = await prisma.note.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: noteId ?? "__this_can't_exist__" },
		create: {
			ownerId: userId,
			title,
			content: formattedContent,
			images: { create: newImages },
		},
		update: {
			title,
			content: formattedContent,
			...(videoData
				? {
						video: {
							...(videoId
								? {
										update: {
											where: { id: videoId },
											data: { ...videoData },
										},
									}
								: {
										create: videoData,
									}),
						},
					}
				: {}),
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
