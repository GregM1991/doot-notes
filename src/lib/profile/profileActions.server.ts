import { redirect, type Cookies } from '@sveltejs/kit'
import { fail, setError, type SuperValidated } from 'sveltekit-superforms'
import { z } from 'zod'
import type { ProfileFormSchema } from '$lib/schemas'
import {
	authSessionCookieName,
	getAuthSessionData,
} from '$lib/server/sessions/authSession'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import type { Message } from '$lib/types'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'

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

export async function deleteDataAction(userId: string, cookies: Cookies) {
	await prisma.user.delete({ where: { id: userId } })
	setToastDataToCookie(cookies, {
		type: 'success',
		title: 'Data Deleted',
		description: 'All of your data has been deleted',
	})
	return redirect(303, '/')
}
