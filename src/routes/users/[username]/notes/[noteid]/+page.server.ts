import { redirect, type Actions, fail } from '@sveltejs/kit'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'

export const actions = {
	default: async ({ params, cookies, locals, request }) => {
		const userId = requireUserId(locals?.userId, request)
		const note = await prisma.note.findFirst({
			select: {
				id: true,
				ownerId: true,
				owner: { select: { username: true } },
			},
			where: { id: params.noteid, ownerId: userId },
		})

		invariantResponse(note, 'Not found', 404)
		const isOwner = note.ownerId === userId
		// TODO: Check if user has permissions (if we get that far 😅)
		if (!isOwner)
			throw fail(403, {
				error: 'Unauthorized',
			})
		setToastDataToCookie(cookies, {
			title: 'Success',
			description: 'Note successfully deleted',
			type: 'success',
			flash: true,
		})

		await prisma.note.delete({
			where: { id: note.id },
		})

		throw redirect(303, './')
	},
} satisfies Actions
