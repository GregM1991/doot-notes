import { toastSessionStorage } from '$lib/server/sessions/toastSessionStorage'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions = {
	default: async ({ params, cookies }) => {
		const note = await prisma.note.findFirst({
			select: { id: true },
			where: { id: params.noteid },
		})
		invariantResponse(note, 'Not found', 404)

		await prisma.note.delete({
			where: { id: note.id },
		})

		throw redirect(303, './')
	},
} satisfies Actions
