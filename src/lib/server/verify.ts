import type { VerificationTypes } from '$routes/(auth)/verify/+page.server'

type PrepareVerificatinParams = {
	period: number
	request: Request
	type: VerificationTypes
	target: string
}

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
