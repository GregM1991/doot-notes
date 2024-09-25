import { z } from 'zod'
import { onboardingEmailSessionKey } from './auth/onboarding'
import { newEmailAddressSessionKey } from './auth/changeEmail.server'
import { resetPasswordUsernameSessionKey } from './auth/resetPassword.server'
import { rememberKey, unverifiedSessionIdKey } from './auth/login.server'

export const VerifySessionSchema = z.object({
	[onboardingEmailSessionKey]: z.string().nullable().default(null),
	[newEmailAddressSessionKey]: z.string().nullable().default(null),
	[resetPasswordUsernameSessionKey]: z.string().nullable().default(null),
	[unverifiedSessionIdKey]: z.string().nullable().default(null),
	[rememberKey]: z.string().nullable().default(null),
})
