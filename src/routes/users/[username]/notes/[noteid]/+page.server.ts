import { toastOptionValues } from '$lib/server/sessions/toast'
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

		const { name, options } = toastOptionValues
		const toastValue = JSON.stringify({
			title: 'Success',
			description: 'Note successfully deleted',
			type: 'success',
			flash: true,
		})
		cookies.set(name, toastValue, options)

		await prisma.note.delete({
			where: { id: note.id },
		})

		throw redirect(303, './')
	},
} satisfies Actions
