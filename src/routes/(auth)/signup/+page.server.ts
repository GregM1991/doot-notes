import { sendEmail } from '$lib/server/email'
import { prepareVerification } from '$lib/auth/verify.server'
import { prisma } from '$lib/utils/db.server.js'
import { parseWithZod } from '@conform-to/zod'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const SignupFormSchema = z.object({
	email: z.string(),
})

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		// TODO: Create honeypot

		// TODO: Parse forms with SuperForm
		const submission = await parseWithZod(formData, {
			schema: SignupFormSchema.superRefine(async (data, ctx) => {
				const existingUser = await prisma.user.findUnique({
					where: { email: data.email },
					select: { id: true },
				})
				if (existingUser) {
					ctx.addIssue({
						path: ['email'],
						code: z.ZodIssueCode.custom,
						message: 'A user already exists with this email',
					})
					return
				}
			}),
			async: true,
		})

		if (submission.status !== 'success') {
			return fail(submission.status === 'error' ? 400 : 200, {
				result: submission.reply(),
			})
		}

		const { email } = submission.value
		const { verifyUrl, redirectTo, otp } = await prepareVerification({
			period: 10 * 60,
			request,
			type: 'onboarding',
			target: email,
		})

		const response = await sendEmail({
			to: email,
			subject: `Let's get Dootin!`,
			html: _signupEmail({ onboardingUrl: verifyUrl.toString(), otp }),
			text: 'Whats this also?',
		})

		if (response.status === 'success') {
			return redirect(303, redirectTo.toString())
		} else {
			fail(500, {
				result: submission.reply({ formErrors: [response.error.message] }),
			})
		}
	},
}

// TODO: move this to relevant server file
export function _signupEmail({
	onboardingUrl,
	otp,
}: {
	onboardingUrl: string
	otp: string
}) {
	return `
	<!DOCTYPE PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>
	<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</head>
		<body>
			<h1>Doot doot! Welcome to Dootnotes</h1>
			<p>Here's your verification code: <strong>${otp}</strong></p>
			<p>Or click the link to get started:</p>
			<p><a href="${onboardingUrl}">${onboardingUrl}</a></p>
		</body>
	</html>
	`
}
