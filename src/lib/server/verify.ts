import { getDomainUrl } from '$lib/utils/misc'
import {
	_codeQueryParam,
	_redirectToQueryParam,
	_targetQueryParam,
	_typeQueryParam,
	type VerificationTypes,
} from '$routes/(auth)/verify/+page.server'
import { generateTOTP, verifyTOTP } from '$lib/server/totp'
import { prisma } from '$lib/utils/db.server'

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
	redirectToUrl.searchParams.set(_typeQueryParam, type)
	redirectToUrl.searchParams.set(_targetQueryParam, target)
	if (redirectTo) {
		redirectToUrl.searchParams.set(_redirectToQueryParam, redirectTo)
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

	verifyUrl.searchParams.set(_codeQueryParam, otp)
	return {
		otp,
		redirectTo,
		verifyUrl,
	}
}
