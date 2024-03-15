import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'

export type FlattenedNoteFormErrors = z.inferFlattenedErrors<
	typeof NewNoteSchema
>['fieldErrors']

const titleMaxLength = 50
const titleMinLength = 1
const contentMaxLength = 10000
const contentMinLength = 1

const NewNoteSchema = zfd.formData({
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
})

export const actions = {
	default: async ({ request, params }) => {
		console.log('server')
		const formData = await request.formData()
		const submission = NewNoteSchema.safeParse(formData)
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
} satisfies Actions
