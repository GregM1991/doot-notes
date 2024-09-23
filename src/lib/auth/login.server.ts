import { prisma } from '$lib/utils/db.server'
import { twoFAVerificationType } from '$lib/profile/consts'
import { getRedirectToUrl } from '$lib/auth/verify.server'
import { sessionKey } from '$lib/utils/auth.server'
import { customRedirect, invariant, safeRedirect } from '$lib/utils/misc'
import { encryptAndSignCookieValue } from '$lib/server/sessions/secureCookie'
import type { Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'
import {
	authSessionCookieName,
	authSessionCookieOptions,
} from '$lib/server/sessions/authSession'
import type { SuperValidated } from 'sveltekit-superforms'
import type { z } from 'zod'
import type { ProfileFormSchema } from '$lib/schemas'
import type { Message } from '$lib/types'
import { verifySessionCookieName } from '$lib/server/sessions/verifySession'

const unverifiedSessionIdKey = 'unverified-session-id'
const rememberKey = 'remember'

type SessionType = {
	id: Session['id']
	userId: Session['userId']
	expirationDate?: Session['expirationDate']
}

type HandleNewSessionParams = {
	request: Request
	cookies: Cookies
	session: SessionType
	remember: boolean | null
	redirectTo?: string
}

export type VerifyFunctionArgs = {
	request: Request
	submission: SuperValidated<
		z.input<typeof ProfileFormSchema>,
		Message,
		z.output<typeof ProfileFormSchema>
	>
	body: FormData | URLSearchParams
	cookies: Cookies
}

export async function handleNewSession(
	{ request, cookies, session, remember, redirectTo }: HandleNewSessionParams,
	responseInit?: ResponseInit,
) {
	const verification = await prisma.verification.findUnique({
		select: { id: true },
		where: {
			target_type: { target: session.userId, type: twoFAVerificationType },
		},
	})
	const userHasTwoFactorEnabled = Boolean(verification)

	if (userHasTwoFactorEnabled) {
		cookies.set(unverifiedSessionIdKey, session.id, authSessionCookieOptions)
		cookies.set(rememberKey, String(remember), authSessionCookieOptions)
		const redirectUrl = getRedirectToUrl({
			request,
			type: twoFAVerificationType,
			target: session.userId,
			redirectTo,
		}).toString()

		return customRedirect(redirectUrl, responseInit)
	} else {
		const encryptedCookieString = encryptAndSignCookieValue({
			[sessionKey]: session.id,
		})
		cookies.set(authSessionCookieName, encryptedCookieString, {
			...authSessionCookieOptions,
			expires: remember ? session.expirationDate : undefined,
		})
		const safeUrl = safeRedirect(redirectTo)

		return customRedirect(safeUrl, responseInit)
	}
}

export async function handleVerification({
	request,
	submission,
	cookies,
}: VerifyFunctionArgs) {
	invariant(submission.valid, 'Submission should be successful by now')

	const authSession = cookies.get(authSessionCookieName)
	const verifySession = cookies.get(verifySessionCookieName)

	const remember = verifySession.get(rememberKey)
	const { redirectTo } = submission.value
	const headers = new Headers()
	authSession.set(verifiedTimeKey, Date.now())

	const unverifiedSessionId = verifySession.get(unverifiedSessionIdKey)
	if (unverifiedSessionId) {
		const session = await prisma.session.findUnique({
			select: { expirationDate: true },
			where: { id: unverifiedSessionId },
		})
		if (!session) {
			throw await redirectWithToast('/login', {
				type: 'error',
				title: 'Invalid session',
				description: 'Could not find session to verify. Please try again.',
			})
		}
		authSession.set(sessionKey, unverifiedSessionId)

		headers.append(
			'set-cookie',
			await authSessionStorage.commitSession(authSession, {
				expires: remember ? session.expirationDate : undefined,
			}),
		)
	} else {
		headers.append(
			'set-cookie',
			await authSessionStorage.commitSession(authSession),
		)
	}

	headers.append(
		'set-cookie',
		await verifySessionStorage.destroySession(verifySession),
	)

	return redirect(safeRedirect(redirectTo), { headers })
}
