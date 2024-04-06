import z from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { fail, redirect, type Action } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { NoteEditorSchema } from './types'

export const newOrUpdate: Action = async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)

	const formData = await request.formData()
	const submission = await parseWithZod(formData, {
		schema: NoteEditorSchema.superRefine(async (data, ctx) => {
			if (!data.id) return

			const note = await prisma.note.findUnique({
				select: { id: true },
				where: { id: data.id, ownerId: userId },
			})
			if (!note) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Note not found',
				})
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return fail(submission.status === 'error' ? 400 : 200, {
			result: submission.reply(),
		})
	}

	const owner = await prisma.user.findUnique({
		select: { id: true },
		where: { id: userId },
	})
	invariantResponse(owner, 'Could not find user of note', 404)

	// TODO: Extracting values here as this'll help when images will be pulled from the transformed data
	const { id: noteId, title, content } = submission.value

	const updatedNote = await prisma.note.upsert({
		select: { id: true, owner: { select: { username: true } } },
		where: { id: noteId ?? "__this_can't_exist__" },
		update: {
			title,
			content,
		},
		create: {
			ownerId: userId,
			title,
			content,
		},
	})

	throw redirect(
		303,
		`/users/${updatedNote.owner.username}/notes/${updatedNote.id}`,
	)
}
