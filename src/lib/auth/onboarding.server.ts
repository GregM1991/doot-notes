import { handleNewVerification } from '$lib/server/sessions/verifySession'
import { invariant } from '$lib/utils/misc'
import type { VerifyFunctionArgs } from '$lib/auth/verify'

export async function handleVerification({
	cookies,
	submission,
}: VerifyFunctionArgs) {
	invariant(
		submission.status === 'success',
		'Submission should be successful by now',
	)
	return handleNewVerification({
		cookies,
		target: submission.value.target,
		redirectTo: '/onboarding',
	})
}
