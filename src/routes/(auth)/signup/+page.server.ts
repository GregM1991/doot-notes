import { redirect } from '@sveltejs/kit'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type PageServerLoad } from './$types'
import { prepareVerification } from '$lib/auth/verify.server'
import { SignupFormSchema } from '$lib/schemas'
import { sendEmail } from '$lib/server/email'
import { prisma } from '$lib/utils/db.server.js'
import { checkHoneypot } from '$lib/utils/honeypot.server'

export const load = (async () => {
	const form = await superValidate(zod(SignupFormSchema))
	return { form }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		const form = await superValidate(formData, zod(SignupFormSchema))
		if (!form.valid) {
			return fail(400, { form })
		}
		checkHoneypot(formData, form)
		const existingUser = await prisma.user.findUnique({
			where: { email: form.data.email },
			select: { id: true },
		})
		if (existingUser) {
			return setError(form, 'email', 'A user already exists with this email')
		}

		const { email } = form.data
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
			return setError(form, '', response.error.message)
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
