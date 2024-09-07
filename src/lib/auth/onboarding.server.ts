import type { VerifyFunctionArgs } from '$lib/auth/verify'
import { handleNewVerification } from '$lib/server/sessions/verifySession'
import { invariant } from '$lib/utils/misc'
import { onboardingEmailSessionKey } from './onboarding'

export async function handleVerification({
	cookies,
	form,
}: VerifyFunctionArgs) {
	invariant(form.valid, 'Form should be successful by now')
	return handleNewVerification({
		cookies,
		target: form.data.target,
		redirectTo: '/onboarding',
		type: onboardingEmailSessionKey,
	})
}
