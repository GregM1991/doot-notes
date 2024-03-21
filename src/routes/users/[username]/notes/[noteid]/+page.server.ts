import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { redirect, type Actions } from '@sveltejs/kit'

export const actions = {
	default: async ({ params, locals }) => {
		const note = await prisma.note.findFirst({
			select: { id: true },
			where: { id: params.noteid },
		})
		invariantResponse(note, 'Not found', 404)

		await prisma.note.delete({
			where: { id: note.id },
		})

		await locals.dn_toast.update(() => ({
			flash: true,
			type: 'success',
			title: 'Success',
			description: 'Your note has been deleted',
		}))
		throw redirect(303, './')
	},
} satisfies Actions
