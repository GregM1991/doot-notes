import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { setError, superValidate } from 'sveltekit-superforms'
import type { Actions, PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { profileUpdateActionIntent } from '$lib/profile/consts'
import {
	ProfileFormSchema,
	profileUpdateAction,
} from '$lib/profile/profileActions.server'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			image: {
				select: { id: true },
			},
			// TODO: Bring in session count
			// _count: {
			// 	select: {
			// 		sessions: {
			// 			where: {
			// 				expirationDate: { gt: new Date() },
			// 			},
			// 		},
			// 	},
			// },
		},
	})
	invariantResponse(user, 'User not found', 404)
	const form = await superValidate(user, zod(ProfileFormSchema))

	return { form, user }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ locals, request, cookies }) => {
		const userId = requireUserId(locals.userId, request)

		const formData = await request.formData()
		const intent = formData.get('intent')

		const form = await superValidate(formData, zod(ProfileFormSchema))

		switch (intent) {
			case profileUpdateActionIntent: {
				return profileUpdateAction(userId, form, cookies)
			}
			default: {
				setError(form, `Invalid intent "${intent}"`, { status: 400 })
			}
		}
	},
} satisfies Actions
