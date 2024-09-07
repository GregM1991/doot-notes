import { redirect } from '@sveltejs/kit'
import { requireRecentVerification } from '$lib/auth/verify.server'
import { twoFAVerificationType } from '$lib/profile/consts'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ request, locals, cookies }) => {
	await requireRecentVerification(locals.userId, request, cookies)
	return {}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals, cookies }) => {
		await requireRecentVerification(locals.userId, request, cookies)
		const userId = requireUserId(locals.userId, request)
		await prisma.verification.delete({
			where: { target_type: { target: userId, type: twoFAVerificationType } },
		})
		setToastDataToCookie(cookies, {
			title: '2FA Disabled',
			description: 'Two factor authentication has been disabled.',
		})
		return redirect(303, '/settings/profile/two-factor')
	},
} satisfies Actions
