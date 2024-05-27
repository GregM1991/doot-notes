import { requireUserId } from '$lib/utils/auth.server'
import { message, setError, superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { ChangeEmailSchema } from '$lib/profile/schemas'
import { prisma } from '$lib/utils/db.server'
import { prepareVerification } from '$lib/auth/verify.server'
import { sendEmail } from '$lib/server/email'
import { handleNewVerification } from '$lib/server/sessions/verifySession'
import {
	emailChangeEmail,
	newEmailAddressSessionKey,
} from '$lib/auth/changeEmail.server'

export const load = (async ({ locals, request }) => {
	void requireUserId(locals.userId, request)
	const changeEmailForm = await superValidate(zod(ChangeEmailSchema))
	return { changeEmailForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals, cookies }) => {
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
			target: userId,
		})

		const response = await sendEmail({
			to: email,
			subject: `Email change request verification from Doot Notes`,
			html: emailChangeEmail({ emailChangeUrl: verifyUrl.toString(), otp }),
			text: 'Whats this also?',
		})

		if (response.status === 'success') {
			return handleNewVerification({
				cookies,
				target: form.data.email,
				redirectTo: `${redirectTo.pathname}${redirectTo.search}`,
				type: newEmailAddressSessionKey,
			})
		} else {
			return message(
				form,
				{ type: 'error', text: response.error.message },
				{ status: 500 },
			)
		}
	},
}
