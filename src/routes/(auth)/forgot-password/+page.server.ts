import { z } from 'zod'
import { superValidate, fail, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions, redirect } from '@sveltejs/kit'
import { prepareVerification } from '$lib/auth/verify.server'
import { forgotPasswordEmail } from '$lib/auth/recoverPassword.server'
import { sendEmail } from '$lib/server/email'
import { prisma } from '$lib/utils/db.server'
import { checkHoneypot } from '$lib/utils/honeypot.server.js'
import { ForgotPasswordSchema } from '$lib/schemas'

export const load = async ({ locals }) => {
	if (locals.userId) throw redirect(303, '/')
	const forgotPasswordForm = await superValidate(zod(ForgotPasswordSchema))

	return { forgotPasswordForm }
}

export const actions = {
	default: async ({ request, cookies }) => {
		// TODO: Create honeypot
		const formData = await request.formData()
		const form = await superValidate(formData, zod(ForgotPasswordSchema))
		if (!form.valid) return fail(400, { form })
		checkHoneypot(formData, form)

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{ email: form.data.usernameOrEmail },
					{ username: form.data.usernameOrEmail },
				],
			},
			select: { id: true, email: true, username: true },
		})
		if (!user) {
			return setError(
				form,
				'usernameOrEmail',
				'No user exists with this username or email',
			)
		}

		const { usernameOrEmail } = form.data

		const { verifyUrl, redirectTo, otp } = await prepareVerification({
			period: 10 * 60,
			request,
			type: 'reset-password',
			target: usernameOrEmail,
		})

		const response = await sendEmail({
			to: user.email,
			subject: `Epic Notes Password Reset`,
			html: forgotPasswordEmail({ verifyUrl: verifyUrl.toString(), otp }),
			text: 'Whats this also?',
		})

		if (response.status === 'success') {
			return redirect(303, redirectTo.toString())
		} else {
			return setError(form, '', 'Failed to send email')
		}
	},
} satisfies Actions
