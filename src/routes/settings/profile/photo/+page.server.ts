import { redirect } from '@sveltejs/kit'
import { fail, superValidate, withFiles } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions, type PageServerLoad } from './$types'
import { PhotoFormSchema } from '$lib/schemas'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'

export const load = (async ({ locals, request, parent }) => {
	void requireUserId(locals.userId, request)

	const parentData = await parent()
	invariantResponse(parentData.user, 'User not found', 404)

	const user = {
		id: parentData.user.id,
		name: parentData.user.name,
		username: parentData.user.username,
		image: parentData.user.image,
	}
	const form = await superValidate(zod(PhotoFormSchema))

	return { user, form }
}) satisfies PageServerLoad

export const actions = {
	delete: async ({ locals, request }) => {
		const userId = requireUserId(locals.userId, request)
		await prisma.userImage.deleteMany({ where: { userId } })
		return redirect(303, '/settings/profile')
	},
	'add-or-update-avatar': async ({ locals, request }) => {
		const userId = requireUserId(locals.userId, request)
		const form = await superValidate(request, zod(PhotoFormSchema))
		if (!form.valid) return fail(400, withFiles({ form }))

		const submissionData = {
			image: {
				contentType: form.data.photoFile.type,
				blob: Buffer.from(await form.data.photoFile.arrayBuffer()),
			},
		}

		await prisma.$transaction(async $prisma => {
			await $prisma.userImage.deleteMany({ where: { userId } })
			await $prisma.user.update({
				where: { id: userId },
				data: { image: { create: submissionData.image } },
			})
		})

		return redirect(303, '/settings/profile')
	},
} satisfies Actions
