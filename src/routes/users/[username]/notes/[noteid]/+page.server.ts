import {
	NoteEditorSchema,
	type FlattenedNoteFormErrors,
} from '$lib/components/EditNote/types'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { redirect, type Actions, fail } from '@sveltejs/kit'

export const actions = {
	newOrUpdate: async ({ request, params }) => {
		const formData = await request.formData()
		const submission = NoteEditorSchema.safeParse(formData)

		if (!submission.success) {
			const errorData = submission.error.flatten()
				.fieldErrors as FlattenedNoteFormErrors //TODO: See if there's a better way to do this - ,-

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

		const { id: noteId } = await prisma.note.create({
			select: { id: true },
			data: {
				title: submission.data.title,
				content: submission.data.content,
				ownerId: owner.id,
			},
		})

		redirect(303, `${noteId}`)
	},
	delete: async ({ params }) => {
		await prisma.note.delete({
			where: { id: params.noteid },
		})

		redirect(303, './')
	},
} satisfies Actions
