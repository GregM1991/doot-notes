import { fail, redirect, type Action } from '@sveltejs/kit'
import {
	NoteEditorSchema,
	type FlattenedNoteFormFieldErrors,
} from '$lib/components/EditNote/types'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { requireUserId } from '$lib/utils/auth.server'

export const newOrUpdate: Action = async ({ request, params, locals }) => {
	// Do something with this
	const userId = requireUserId(locals.userId, request)

	const formData = await request.formData()
	const submission = NoteEditorSchema.safeParse(formData)

	if (!submission.success) {
		const errorData = submission.error.flatten()
			.fieldErrors as FlattenedNoteFormFieldErrors //TODO: See if there's a better way to do this - ,-

		const data = {
			data: Object.fromEntries(formData),
			errors: errorData,
		}

		return fail(400, data)
	}

	const owner = await prisma.user.findUnique({
		select: { id: true },
		where: { username: params.username },
	})
	invariantResponse(owner, 'Could not find user of note', 404)

	const note = {
		title: submission.data.title,
		content: submission.data.content,
		ownerId: owner.id,
	}
	const { id: noteId } = await prisma.note.upsert({
		select: { id: true },
		where: { id: submission.data.id ?? "__this_can't_exist__" },
		update: note,
		create: note,
	})

	throw redirect(303, `/users/${params.username}/notes/${noteId}`)
}
