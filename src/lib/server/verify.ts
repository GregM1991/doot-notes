import { getDomainUrl } from '$lib/utils/misc'
import {
	_redirectToQueryParam,
	_targetQueryParam,
	_typeQueryParam,
	type VerificationTypes,
} from '$routes/(auth)/verify/+page.server'

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
  This function TODO: rest
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
	// Get redirect URl (getRedirectToUrl({request, type, target}))

	// generate otp and ...verificationConfig (generateTOTP({algorithm: 'SHA256', charset: 'ABCDEFGHIJKLMNOPPQRSTUVWXYZ123456789', period}))

	// create verificationData (obj with type, target, ...verificationConfig, expiresAt)

	// create or update verification in db

	// add otp to url we'll send to the user

	// return otp, redirectTo, verifyUrl
}
