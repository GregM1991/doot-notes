import { createId as cuid } from '@paralleldrive/cuid2'
import { redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import {
	extractImageGroup,
	extractVideoGroup,
	isErrorWithMessage,
	transformImageData,
} from '$lib/utils/misc'
import {
	ImageFieldsetListSchema,
	NoteEditorSchema,
	VideoFieldSchema,
} from '$lib/schemas'
import VideoUploadProcessor from '$lib/video/videoUploadProcessor'
import type { VideoMetadata } from '$lib/video/types.video'

export const newOrUpdate: Action = async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const formData = await request.formData()
	const form = await superValidate(formData, zod(NoteEditorSchema))
	if (!form.valid) return fail(400, { form })

	const images = extractImageGroup(formData)
	const imageSubmission = ImageFieldsetListSchema.safeParse(images)
	const video = extractVideoGroup(formData)
	const videoSubmission = VideoFieldSchema.safeParse(video)

	if (!videoSubmission.success)
		return setError(form, '', videoSubmission.error.formErrors.formErrors)
	if (!imageSubmission.success)
		return setError(form, '', imageSubmission.error.formErrors.formErrors)

	// Video handling
	const { file, id: videoId } = videoSubmission.data
	if (videoId) {
		// handle deletions from cloudflare
	}
	let videoData:
		| (VideoMetadata & { videoKey: string; thumbnailKey: string })
		| undefined
	if (file) {
		try {
			const videoProcessor = new VideoUploadProcessor(request)
			const { uploadedVideoKey, thumbnailKey, metadata } =
				await videoProcessor.processVideoUpload(file, userId)
			videoData = {
				videoKey: uploadedVideoKey,
				thumbnailKey,
				...metadata,
			}
		} catch (error) {
			if (isErrorWithMessage(error)) {
				console.error(error.message)
				setError(form, '', error.message)
				return
			}
			setError(form, '', 'Unable to upload video')
		}
	}

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
