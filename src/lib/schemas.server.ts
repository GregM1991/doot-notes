import { z } from 'zod'
import { onboardingEmailSessionKey } from './auth/onboarding'
import { newEmailAddressSessionKey } from './auth/changeEmail.server'
import { resetPasswordUsernameSessionKey } from './auth/resetPassword.server'

export const VerifySessionSchema = z.object({
	[onboardingEmailSessionKey]: z.string().nullable().default(null),
	[newEmailAddressSessionKey]: z.string().nullable().default(null),
	[resetPasswordUsernameSessionKey]: z.string().nullable().default(null),
})
