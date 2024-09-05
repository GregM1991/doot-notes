import { generateTOTP } from '@epic-web/totp'
import { redirect } from '@sveltejs/kit'
import { type Actions, type PageServerLoad } from './$types'
import {
	twoFAVerificationType,
	twoFAVerifyVerificationType,
} from '$lib/profile/consts'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'

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
		const { otp: _otp, ...config } = generateTOTP()
		console.log('Generated TOTP:', _otp) // TODO: What's going on with this
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
