import { prisma } from '$lib/utils/db.server'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions = {
	default: async ({ params }) => {
		await prisma.note.delete({
			where: { id: params.noteid },
		})

		redirect(303, './')
	},
} satisfies Actions
