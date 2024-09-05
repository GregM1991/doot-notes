import { redirect, type Actions, type Cookies } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type PageServerLoad } from './$types'
import { onboardingEmailSessionKey } from '$lib/auth/onboarding'
import { OnboardingSchema } from '$lib/schemas'
import { handleNewSession } from '$lib/server/sessions/authSession'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import {
	getVerifySessionData,
	verifySessionCookieName,
	verifySessionCookieOptions,
} from '$lib/server/sessions/verifySession'
import { signup, requireAnonymous } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { checkHoneypot } from '$lib/utils/honeypot.server'
import { safeRedirect } from '$lib/utils/misc'

async function requireOnboardingEmail(userId: string | null, cookies: Cookies) {
	requireAnonymous(userId)
	const verifySessionData = getVerifySessionData(cookies)
	const onBoardingEmail = verifySessionData
		? verifySessionData[onboardingEmailSessionKey]
		: null
	if (!onBoardingEmail || typeof onBoardingEmail !== 'string')
		redirect(303, '/signup')
	return onBoardingEmail
}

export const load = (async ({ locals, cookies }) => {
	const email = await requireOnboardingEmail(locals.userId, cookies)
	const form = await superValidate(zod(OnboardingSchema))
	return { email, form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ locals, cookies, request }) => {
		const email = await requireOnboardingEmail(locals.userId, cookies)
		const formData = await request.formData()
		const form = await superValidate(formData, zod(OnboardingSchema)) // TODO: Why isn't this giving data. Check the signupFormSchema, try a simpler thing?
		checkHoneypot(formData, form)
		if (!form.valid) return fail(400, { form })
		const user = await prisma.user.findUnique({
			where: { username: form.data.username },
			select: { id: true },
		})
		if (user) {
			return setError(
				form,
				'username',
				'A user already exists with this username',
			)
		}
		const session = await signup({ ...form.data, email })
		if (!session) return { form }

		const { remember, redirectTo } = form.data

		// destroy the verify session
		cookies.delete(verifySessionCookieName, verifySessionCookieOptions)
		// create the auth session
		handleNewSession({
			cookies,
			session: { id: session.id },
			remember: remember ?? null,
		})
		// redirect with toast
		setToastDataToCookie(cookies, {
			title: 'Welcome',
			description: 'Thanks for signing up!',
		})
		redirect(303, safeRedirect(redirectTo ?? null))
	},
} satisfies Actions
