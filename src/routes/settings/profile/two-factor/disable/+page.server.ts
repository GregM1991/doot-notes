import { requireRecentVerification } from '$lib/auth/verify.server'
import { twoFAVerificationType } from '$lib/profile/consts'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { setToast } from '$lib/utils/misc'

export const load = (async ({ request, locals }) => {
	await requireRecentVerification(request, locals)
	return {}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		await requireRecentVerification(request, locals)
		const userId = requireUserId(locals.userId, request)
		await prisma.verification.delete({
			where: { target_type: { target: userId, type: twoFAVerificationType } },
		})
		locals.toast = setToast({
			title: '2FA Disabled',
			description: 'Two factor authentication has been disabled.',
		})
		return redirect(303, '/settings/profile/two-factor')
	},
} satisfies Actions
