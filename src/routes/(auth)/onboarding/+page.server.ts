import { requireAnonymous } from '$lib/utils/auth.server'
import { redirect, type Actions, type Cookies } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {
	getVerifySessionData,
	verifySessionCookieName,
} from '$lib/server/sessions/verifySession'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { NameSchema, UsernameSchema } from '$lib/utils/userValidation'
import { prisma } from '$lib/utils/db.server'

const SignupFormSchema = z.object({
	username: UsernameSchema,
	name: NameSchema,
	agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
		required_error:
			'You must agree to the terms of service and privacy policy.',
	}),
	remember: z.boolean().optional(),
	redirectTo: z.string().optional(),
})

export const load = (async ({ locals, cookies }) => {
	const email = await requireOnboardingEmail(locals.userId, cookies)
	return { email }
}) satisfies PageServerLoad

async function requireOnboardingEmail(userId: string | null, cookies: Cookies) {
	await requireAnonymous(userId)
	const verifySessionCookie = cookies.get(verifySessionCookieName)
	const verifySessionData = getVerifySessionData(verifySessionCookie)
	if (!verifySessionData) redirect(303, '/signup')
	return verifySessionData
}

export const actions = {
	default: async ({ locals, cookies, request }) => {
		const email = requireOnboardingEmail(locals.userId, cookies)
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
	},
} satisfies Actions