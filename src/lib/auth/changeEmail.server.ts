import { getVerifySessionData } from '$lib/server/sessions/verifySession'
import { invariant } from '$lib/utils/misc'
import type { VerifyFunctionArgs } from '$lib/auth/verify'
import { message } from 'sveltekit-superforms'
import { prisma } from '$lib/utils/db.server'
import { sendEmail } from '$lib/server/email'
import { requireRecentVerification } from './verify.server'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import { redirect } from '@sveltejs/kit'

export const newEmailAddressSessionKey = 'new-email-address'

export async function handleVerification({
	cookies,
	request,
	form,
	userId,
}: VerifyFunctionArgs) {
	await requireRecentVerification(userId ?? null, request, cookies)
	invariant(form.valid, 'Form should be successful by now')
	const verifySession = getVerifySessionData(cookies)
	const newEmail = verifySession
		? verifySession[newEmailAddressSessionKey]
		: null

	if (!newEmail) {
		return message(
			form,
			{
				type: 'error',
				text: 'You must submit the code on the same device that requested the email change.',
			},
			{ status: 400 },
		)
	}
	const preUpdatedUser = await prisma.user.findFirstOrThrow({
		select: { email: true },
		where: { id: form.data.target },
	})
	const user = await prisma.user.update({
		where: { id: form.data.target },
		select: { id: true, email: true, username: true },
		data: { email: newEmail },
	})

	void sendEmail({
		to: preUpdatedUser.email,
		subject: 'Doot Notes email changed',
		html: emailChangeNoticeEmail(user.id),
		text: 'Whats this also?',
	})

	setToastDataToCookie(cookies, {
		title: 'Success',
		description: 'Email successfully updated',
		type: 'success',
	})
	return redirect(302, '/settings/profile')
}

export function emailChangeEmail({
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

export function emailChangeNoticeEmail(userId: string) {
	return `
	<!DOCTYPE PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>
	<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</head>
		<body>
			<h1>Your Doot Notes email has been changed! Huzzuh!</h1>
				<p>
					We're dooting you to let you know that your Doot Notes email has been changed.
				</p>
				<p>
					If you, yourself, entered a new email address, then go ahead and safely ignore this!
					But if you did not change your email address, then please contact support immediately.
				</p>
				<p>Your Account ID: ${userId}</p>
		</body>
	</html>
	`
}
