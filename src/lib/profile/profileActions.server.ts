import { z } from 'zod'
import { fail, setError, type SuperValidated } from 'sveltekit-superforms'
import { NameSchema, UsernameSchema } from '$lib/utils/userValidation'
import { prisma } from '$lib/utils/db.server'
import type { Message } from '$lib/types'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import type { Cookies } from '@sveltejs/kit'
import {
	authSessionCookieName,
	getAuthSessionData,
} from '$lib/server/sessions/authSession'
import { invariantResponse } from '$lib/utils/misc'

export const ProfileFormSchema = z.object({
	name: NameSchema.optional(),
	username: UsernameSchema,
})

type Form = SuperValidated<
	z.input<typeof ProfileFormSchema>,
	Message,
	z.output<typeof ProfileFormSchema>
>

export async function profileUpdateAction(
	userId: string,
	form: Form,
	cookies: Cookies,
) {
	if (!form.valid) return fail(400, { form })

	const existingUser = await prisma.user.findUnique({
		where: { username: form.data.username },
		select: { id: true, username: true },
	})

	if (existingUser && existingUser.id !== userId)
		return setError(form, 'username', 'Username already exists')

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			name: form.data.name,
			username: form.data.username,
		},
	})
	setToastDataToCookie(cookies, {
		title: 'Success',
		description: 'Username/name successfully updated',
		type: 'success',
	})
	return { form }
}

export async function signOutOfSessionsAction(
	userId: string,
	form: Form,
	cookies: Cookies,
) {
	const sessionCookie = cookies.get(authSessionCookieName)
	const sessionData = getAuthSessionData(sessionCookie)

	invariantResponse(
		sessionData,
		'You must be authenticated to sign out of other sessions',
	)
	const { sessionId } = sessionData
	await prisma.session.deleteMany({
		where: {
			userId,
			id: { not: sessionId },
		},
	})
	return { form }
}
