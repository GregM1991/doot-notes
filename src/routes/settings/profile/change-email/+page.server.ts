import { requireUserId } from '$lib/utils/auth.server'
import { fail, message, setError, superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { ChangeEmailSchema } from '$lib/profile/schemas'
import { prisma } from '$lib/utils/db.server'
import { z } from 'zod'
import { prepareVerification } from '$lib/auth/verify.server'
import { sendEmail } from '$lib/server/email'
import { redirect } from '@sveltejs/kit'

export const load = (async ({ locals, request }) => {
	void requireUserId(locals.userId, request)
	const changeEmailForm = await superValidate(zod(ChangeEmailSchema))
	return { changeEmailForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const userId = requireUserId(locals.userId, request)

		const form = await superValidate(request, zod(ChangeEmailSchema))
		if (!form.valid) return { form }
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
			type: 'change-email',
			target: email,
		})

		const response = await sendEmail({
			to: email,
			subject: `Email change request verification from Doot Notes`,
			html: _emailChangeEmail({ emailChangeUrl: verifyUrl.toString(), otp }),
			text: 'Whats this also?',
		})

		if (response.status === 'success') {
			return redirect(303, redirectTo.toString())
		} else {
			return message(form, response.error.message, { status: 500 })
		}
	},
}

export function _emailChangeEmail({
	emailChangeUrl,
	otp,
}: {
	emailChangeUrl: string
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
			<h1>Doot doot! Here's the code to change your e-mail address</h1>
			<p>Use this verification code: <strong>${otp}</strong></p>
			<p>Or click the link to get started:</p>
			<p><a href="${emailChangeUrl}">${emailChangeUrl}</a></p>
		</body>
	</html>
	`
}
