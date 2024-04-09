import { requireAnonymous } from '$lib/utils/auth.server'
import { redirect, type Actions, type Cookies } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {
	getVerifySessionData,
	verifySessionCookieName,
} from '$lib/server/sessions/verifySession'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding.server'

export const load = (async ({ locals, cookies }) => {
	const email = await requireOnboardingEmail(locals.userId, cookies)
	return { email }
}) satisfies PageServerLoad

async function requireOnboardingEmail(userId: string | null, cookies: Cookies) {
	await requireAnonymous(userId)
	const verifySessionCookie = cookies.get(verifySessionCookieName)
	const verifySessionData = getVerifySessionData(verifySessionCookie)

	if (!verifySessionData || !verifySessionData[onboardingEmailSessionKey])
		redirect(303, '/signup')
	return verifySessionData[onboardingEmailSessionKey]
}

export const actions = {
	default: async () => {
		console.log('onboarding action')
	},
} satisfies Actions