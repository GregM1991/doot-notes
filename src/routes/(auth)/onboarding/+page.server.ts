import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit'
import {
	SignupFormSchema,
	SignupFormSubmissionSchema,
} from '$lib/auth/onboarding'
import {
	getVerifySessionData,
	verifySessionCookieName,
	verifySessionCookieOptions,
} from '$lib/server/sessions/verifySession'
import { handleNewSession } from '$lib/server/sessions/authSession'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import { signup, requireAnonymous } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { safeRedirect } from '$lib/utils/misc'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals, cookies }) => {
	const email = await requireOnboardingEmail(locals.userId, cookies)
	return { email }
}) satisfies PageServerLoad

async function requireOnboardingEmail(userId: string | null, cookies: Cookies) {
	await requireAnonymous(userId)
	const verifySessionCookie = cookies.get(verifySessionCookieName)
	const verifySessionData = getVerifySessionData(verifySessionCookie)
	if (!verifySessionData || typeof verifySessionData !== 'string')
		redirect(303, '/signup')
	return verifySessionData
}

export const actions = {
	default: async ({ locals, cookies, request }) => {
		const email = await requireOnboardingEmail(locals.userId, cookies)
		const formData = await request.formData()
		// TODO: check honeypot

		const submission = await parseWithZod(formData, {
			schema: intent =>
				SignupFormSchema.superRefine(async (data, ctx) => {
					const user = await prisma.user.findUnique({
						where: { username: data.username },
						select: { id: true },
					})
					if (user) {
						ctx.addIssue({
							path: ['username'],
							code: z.ZodIssueCode.custom,
							message: 'A user already exists with this username',
						})
						return
					}
				}).transform(async data => {
					if (intent !== null) return { ...data, session: null }

					const session = await signup({ ...data, email })
					return { ...data, session }
				}),
			async: true,
		})
		if (submission.status !== 'success' || !submission.value.session) {
			// PICK-UP: Was trying to figure out how I can shape this return from fail
			// so I know for sure the shape
			const parsedSubmission = SignupFormSubmissionSchema.refine(data => {
				console.log({ data })
				return {
					confirm: data.confirm ?? '',
					name: data.name ?? '',
					password: data.confirm ?? '',
					username: data.confirm ?? '',
				}
			}).parse(submission.reply())
			console.log({ parsedSubmission })
			// TODO: Can this be extracted to util?
			return fail(submission.status === 'error' ? 400 : 200, {
				result: submission.reply(),
			})
			/* 
				{
					"result": {
						"status": "error",
						"initialValue": {
							"confirm": "!4mA$trongPassw0rd",
							"name": "gregtest martintest",
							"password": "!4mA$trongPassw0rd",
							"username": "gregtestusername"
						},
						"error": {
							"agreeToTermsOfServiceAndPrivacyPolicy": [
								"You must agree to the terms of service and privacy policy."
							],
							"confirmPassword": [
								"Password is required"
							]
						},
						"fields": [
							"username",
							"name",
							"password",
							"confirm"
						]
					}
				}
			*/
		}

		const { session, remember, redirectTo } = submission.value

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
