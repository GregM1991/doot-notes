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
			where: { id: params.noteId, ownerId: userId },
		})
		await new Promise(fulfil => setTimeout(fulfil, 3000))
		invariantResponse(note, 'Not found', 404)
		const isOwner = note.ownerId === userId
		// TODO: Check if user has permissions
		// TODO: PICKUP get a optomistic UI cranking here
		if (!isOwner)
			throw fail(403, {
				error: 'Unauthorized',
			})
		setToastDataToCookie(cookies, {
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
