import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { fail, type Cookies } from '@sveltejs/kit'
import { handleVerification as handleOnboardingVerification } from '$lib/auth/onboarding.server'
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
	console.log({ period, request, type, target })
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
) {
	const submission = await parseWithZod(body, {
		schema: VerifySchema.superRefine(async (data, ctx) => {
			const codeIsValid = await isCodeValid({
				code: data[codeQueryParam],
				type: data[typeQueryParam],
				target: data[targetQueryParam],
			})
			if (!codeIsValid) {
				ctx.addIssue({
					path: ['code'],
					code: z.ZodIssueCode.custom,
					message: `Invalid code`,
				})
				return
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return fail(submission.status === 'error' ? 400 : 200, {
			result: submission.reply(),
		})
	}

	// ensurePrimary ~~~ This has to do with caching with fly.io I believe 🤷🏻

	const { value: submissionValue } = submission

	async function deleteVerification() {
		await prisma.verification.delete({
			where: {
				target_type: {
					type: submissionValue[typeQueryParam],
					target: submissionValue[targetQueryParam],
				},
			},
		})
	}

	switch (submissionValue[typeQueryParam]) {
		// case 'reset-password': {
		//   await deleteVerification()
		//   return handleResetPasswordVerification({ request, body, submission })
		// }
		case 'onboarding': {
			await deleteVerification()
			return handleOnboardingVerification({
				cookies,
				request,
				body,
				submission,
			})
		}
		// case 'change-email': {
		//   await deleteVerification()
		//   return handleChangeEmailVerification({ request, body, submission})
		// }
		// case '2fa': {
		//   await deleteVerification()
		//   return handleLoginTwoFactorVerification({ request, body, submission})
		// }
	}
}

async function isCodeValid({ code, type, target }: IsCodeValidParams) {
	console.log({ code, type, target })
	return true
}
