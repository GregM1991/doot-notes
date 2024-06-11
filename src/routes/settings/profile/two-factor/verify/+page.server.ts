import * as QRCode from 'qrcode'
import { getTOTPAuthUri } from '@epic-web/totp'
import { redirect } from '@sveltejs/kit'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import {
	twoFAVerificationType,
	twoFAVerifyVerificationType,
} from '$lib/profile/consts'
import { getDomainUrl } from '$lib/utils/misc'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { setError, superValidate } from 'sveltekit-superforms'
import { isCodeValid } from '$lib/auth/verify.server'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import { TwoFactorVerifySchema } from '$lib/schemas'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	const verification = await prisma.verification.findUnique({
		where: {
			target_type: { type: twoFAVerifyVerificationType, target: userId },
		},
		select: {
			id: true,
			algorithm: true,
			secret: true,
			period: true,
			digits: true,
		},
	})

	if (!verification) {
		return redirect(302, '/settings/profile/two-factor')
	}
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		select: { email: true },
	})
	const issuer = new URL(getDomainUrl(request)).host
	const otpUri = getTOTPAuthUri({
		...verification,
		accountName: user.email,
		issuer,
	})
	const qrCode = await QRCode.toDataURL(otpUri)
	const verifyTwoFactorForm = await superValidate(zod(TwoFactorVerifySchema))
	return { otpUri, qrCode, verifyTwoFactorForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const userId = requireUserId(locals.userId, request)

		const form = await superValidate(request, zod(TwoFactorVerifySchema))
		if (!form.valid) return { form }
		if (form.data.intent === 'verify') {
			const codeIsValid = isCodeValid({
				code: form.data.code,
				type: twoFAVerifyVerificationType,
				target: userId,
			})
			if (!codeIsValid) {
				return setError(form, 'code', 'Invalid code')
			}
		}

		switch (form.data.intent) {
			case 'cancel': {
				await prisma.verification.deleteMany({
					where: { type: twoFAVerifyVerificationType, target: userId },
				})
				return redirect(303, '/settings/profile/two-factor')
			}
			case 'verify': {
				await prisma.verification.update({
					where: {
						target_type: { type: twoFAVerifyVerificationType, target: userId },
					},
					data: { type: twoFAVerificationType },
				})
				setToastDataToCookie(cookies, {
					title: 'Enabled',
					description: 'Two-factor authentication has been enabled.',
					type: 'success',
				})
				return redirect(303, '/settings/profile/two-factor')
			}
		}
	},
}
