import { redirect, type Actions, fail } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse, setToast } from '$lib/utils/misc'

export const actions = {
	default: async ({ params, cookies, locals, request }) => {
		const userId = requireUserId(locals?.userId, request)
		const note = await prisma.note.findFirst({
			select: {
				id: true,
				ownerId: true,
				owner: { select: { username: true } },
			},
			where: { id: params.noteId, ownerId: userId },
		})

		invariantResponse(note, 'Not found', 404)
		const isOwner = note.ownerId === userId
		// TODO: Check if user has permissions
		if (!isOwner)
			throw fail(403, {
				error: 'Unauthorized',
			})
		locals.toast = setToast({
			title: 'Success',
			description: 'Note successfully deleted',
			type: 'success',
		})

		await prisma.note.delete({
			where: { id: note.id },
		})

		throw redirect(303, './')
	},
} satisfies Actions
