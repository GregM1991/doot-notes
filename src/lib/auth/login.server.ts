import { prisma } from '$lib/utils/db.server'
import { twoFAVerificationType } from '$lib/profile/consts'
import { getRedirectToUrl } from '$lib/auth/verify.server'
import { sessionKey } from '$lib/utils/auth.server'
import { customRedirect, invariant, safeRedirect } from '$lib/utils/misc'
import { encryptAndSignCookieValue } from '$lib/server/sessions/secureCookie'
import { redirect, type Cookies } from '@sveltejs/kit'
import type { Session } from '@prisma/client'
import {
	authSessionCookieName,
	authSessionCookieOptions,
	setNewAuthProperty,
} from '$lib/server/sessions/authSession'
import type { SuperValidated } from 'sveltekit-superforms'
import type { z } from 'zod'
import type { VerifySchema } from '$lib/schemas'
import type { Message } from '$lib/types'
import {
	getVerifySessionData,
	setVerificationCookieData,
	verifySessionCookieName,
	verifySessionCookieOptions,
} from '$lib/server/sessions/verifySession'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'

const verifiedTimeKey = 'verified-time'
export const unverifiedSessionIdKey = 'unverified-session-id'
export const rememberKey = 'remember'

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
	form: SuperValidated<
		z.input<typeof VerifySchema>,
		Message,
		z.output<typeof VerifySchema>
	>
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
		setVerificationCookieData(unverifiedSessionIdKey, session.id, cookies)
		setVerificationCookieData(rememberKey, String(remember), cookies)
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
	form,
	cookies,
}: VerifyFunctionArgs) {
	invariant(form.valid, 'Submission should be successful by now')

	const verifySessionData = getVerifySessionData(cookies)
	const remember = verifySessionData?.remember
	const { redirectTo } = form.data

	setNewAuthProperty(cookies, verifiedTimeKey, Date.now().toString())

	const unverifiedSessionId = verifySessionData?.[unverifiedSessionIdKey]
	if (unverifiedSessionId) {
		const session = await prisma.session.findUnique({
			select: { expirationDate: true },
			where: { id: unverifiedSessionId },
		})
		if (!session) {
			setToastDataToCookie(cookies, {
				type: 'error',
				title: 'Invalid session',
				description: 'Could not find session to verify. Please try again.',
			})
			throw redirect(302, '/login')
		}
		setNewAuthProperty(cookies, sessionKey, unverifiedSessionId)
		if (remember) {
			setNewAuthProperty(cookies, 'sessionExpiry', session.expirationDate)
		}
	}
	cookies.delete(verifySessionCookieName, verifySessionCookieOptions)

	const safeUrl = safeRedirect(redirectTo)
	return redirect(303, safeUrl)
}
