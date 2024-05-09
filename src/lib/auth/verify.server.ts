import { type Cookies } from '@sveltejs/kit'
import { handleVerification as handleOnboardingVerification } from '$lib/auth/onboarding.server'
import { handleVerification as handleChangeEmailVerification } from '$lib/auth/changeEmail.server'
import {
	codeQueryParam,
	redirectToQueryParam,
	targetQueryParam,
	typeQueryParam,
	type IsCodeValidParams,
	type VerificationTypes,
	VerifySchema,
} from '$lib/auth/verify'
import { generateTOTP, verifyTOTP } from '$lib/server/totp'
import { prisma } from '$lib/utils/db.server'
import { getDomainUrl } from '$lib/utils/misc'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { requireUserId } from '$lib/utils/auth.server'

type PrepareVerificatinParams = {
	period: number
	request: Request
	type: VerificationTypes
	target: string
}

type GetRedirectToUrlParams = {
	request: Request
	type: VerificationTypes
	target: string
	redirectTo?: string
}

/*
  This function takes in the type of verification and adds the necessary search
  params to a base domain URL and returns the URL
*/
export function getRedirectToUrl({
	request,
	type,
	target,
	redirectTo,
}: GetRedirectToUrlParams) {
	const redirectToUrl = new URL(`${getDomainUrl(request)}/verify`)
	redirectToUrl.searchParams.set(typeQueryParam, type)
	redirectToUrl.searchParams.set(targetQueryParam, target)
	if (redirectTo) {
		redirectToUrl.searchParams.set(redirectToQueryParam, redirectTo)
	}

	return redirectToUrl
}

export async function requireRecentVerification(
	userId: string | null,
	request: Request,
) {
	void requireUserId(userId, request)
	const shouldReverify = false // await shouldRequestTwoFA(request)
	if (shouldReverify) {
		// TODO: When 2FA is implementd
		// const reqUrl = new URL(request.url)
		// const redirectUrl = getRedirectToUrl({
		// 	request,
		// 	target: userId,
		// 	type: twoFAVerificationType,
		// 	redirectTo: reqUrl.pathname + reqUrl.search,
		// })
		// throw await redirectWithToast(redirectUrl.toString(), {
		// 	title: 'Please Reverify',
		// 	description: 'Please reverify your account before proceeding',
		// })
	}
}

/* 
  This function will generate a new one time password and config to create or edit
   a new verification in the db. We'll set the verification code in the url we'll email
   to user (this is for automatic filling of the code when they click the link)
*/
export async function prepareVerification({
	period,
	request,
	type,
	target,
}: PrepareVerificatinParams) {
	const verifyUrl = getRedirectToUrl({ request, type, target })
	const redirectTo = new URL(verifyUrl.toString())

	const { otp, ...verificationConfig } = generateTOTP({
		algorithm: 'SHA256',
		charSet: 'ABCDEFGHIJKLMNOPPQRSTUVWXYZ123456789',
		period,
	})
	const verificationData = {
		type,
		target,
		...verificationConfig,
		expiresAt: new Date(Date.now() + verificationConfig.period * 1000),
	}

	void (await prisma.verification.upsert({
		where: { target_type: { target, type } },
		create: verificationData,
		update: verificationData,
	}))

	verifyUrl.searchParams.set(codeQueryParam, otp)
	return {
		otp,
		redirectTo,
		verifyUrl,
	}
}

export async function validateRequest(
	cookies: Cookies,
	request: Request,
	body: FormData | URLSearchParams,
	userId: string | null,
) {
	const form = await superValidate(body, zod(VerifySchema))
	if (!form.valid) return { form }
	const codeIsValid = await isCodeValid({
		code: form.data[codeQueryParam],
		type: form.data[typeQueryParam],
		target: form.data[targetQueryParam],
	})
	if (!codeIsValid) {
		return message(
			form,
			{ type: 'error', text: 'Invalid code' },
			{ status: 400 },
		)
	}

	// ensurePrimary ~~~ This has to do with caching with fly.io I believe 🤷🏻

	const { data: formValue } = form

	async function deleteVerification() {
		await prisma.verification.delete({
			where: {
				target_type: {
					type: formValue[typeQueryParam],
					target: formValue[targetQueryParam],
				},
			},
		})
	}

	switch (formValue[typeQueryParam]) {
		// case 'reset-password': {
		//   await deleteVerification()
		//   return handleResetPasswordVerification({ request, body, form })
		// }
		case 'onboarding': {
			await deleteVerification()
			return handleOnboardingVerification({
				cookies,
				request,
				body,
				form,
			})
		}
		case 'change-email': {
			await deleteVerification()
			return handleChangeEmailVerification({
				cookies,
				request,
				body,
				form,
				userId,
			})
		}
		// case '2fa': {
		//   await deleteVerification()
		//   return handleLoginTwoFactorVerification({ request, body, form})
		// }
	}
}

/*
	This func-a-litious takes a one-time-password and checks to see whether
	there is a verification saved in the database that matches the target and 
	type (target=john.doe@johns.do.main.com type=email). We can then reject
	if there's no verification found, or if there is one found but the code isn't
	valid (those nasty h4cker$).
*/
async function isCodeValid({ code, type, target }: IsCodeValidParams) {
	const verification = await prisma.verification.findUnique({
		where: {
			target_type: { target, type },
			OR: [{ expiresAt: { gt: new Date() } }, { expiresAt: null }],
		},
	})

	if (!verification) return false
	const result = verifyTOTP({
		otp: code,
		...verification,
	})

	if (!result) return false

	return true
}
