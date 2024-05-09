import { z } from 'zod'
import { parseWithZod } from '@conform-to/zod'
import { fail, redirect, type Actions, type Cookies } from '@sveltejs/kit'
import {
	SignupFormSchema,
	SignupFormInitialValueSchema,
} from '$lib/auth/onboarding'
import {
	getOrSetVerifySessionData,
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
	const verifySessionData = getOrSetVerifySessionData(
		verifySessionCookie,
		cookies,
	)
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
			const submissionInitialValue = submission.reply().initialValue
			// TODO: Can a reply util be created to generate types for the reply method?
			const initialValue = SignupFormInitialValueSchema.safeParse(
				submissionInitialValue ?? {},
			)

			// TODO: Can this be extracted to util?
			return fail(submission.status === 'error' ? 400 : 200, {
				result: {
					...submission.reply(),
					initialValue: initialValue.success ? initialValue.data : {},
				},
			})
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
