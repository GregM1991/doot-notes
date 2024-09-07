import { setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import {
	deleteDataActionIntent,
	profileUpdateActionIntent,
	signOutOfSessionsActionIntent,
	twoFAVerificationType,
} from '$lib/profile/consts'
import {
	deleteDataAction,
	profileUpdateAction,
	signOutOfSessionsAction,
} from '$lib/profile/profileActions.server'
import { ProfileFormSchema } from '$lib/schemas'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import type { Actions, PageServerLoad } from './$types'

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
			_count: {
				select: {
					sessions: {
						where: {
							expirationDate: { gt: new Date() },
						},
					},
				},
			},
		},
	})
	invariantResponse(user, 'User not found', 404)
	const twoFactorVerification = await prisma.verification.findUnique({
		select: { id: true },
		where: { target_type: { type: twoFAVerificationType, target: userId } },
	})
	const form = await superValidate(user, zod(ProfileFormSchema))

	return { form, user, isTwoFactorEnabled: Boolean(twoFactorVerification) }
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
			case signOutOfSessionsActionIntent: {
				return signOutOfSessionsAction(userId, form, cookies)
			}
			case deleteDataActionIntent: {
				return deleteDataAction(userId, cookies)
			}
			default: {
				setError(form, `Invalid intent "${intent}"`, { status: 400 })
			}
		}
	},
} satisfies Actions
