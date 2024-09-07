import { generateTOTP } from '@epic-web/totp'
import {
	twoFAVerificationType,
	twoFAVerifyVerificationType,
} from '$lib/profile/consts'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import type { Actions, PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const verification = await prisma.verification.findUnique({
		where: { target_type: { type: twoFAVerificationType, target: userId } },
		select: { id: true },
	})
	return { isTwoFactorEnabled: Boolean(verification) }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const userId = requireUserId(locals.userId, request)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { otp: _otp, ...config } = generateTOTP()
		const verificationData = {
			...config,
			type: twoFAVerifyVerificationType,
			target: userId,
		}
		await prisma.verification.upsert({
			where: {
				target_type: { target: userId, type: twoFAVerifyVerificationType },
			},
			create: verificationData,
			update: verificationData,
		})
		redirect(303, '/settings/profile/two-factor/verify')
	},
} satisfies Actions
