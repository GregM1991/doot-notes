import {
	NameSchema,
	PasswordSchema,
	UsernameSchema,
} from '$lib/utils/userValidation'
import { z } from 'zod'

export const onboardingEmailSessionKey = 'onboarding-email'

export const SignupFormSchema = z
	.object({
		username: UsernameSchema,
		name: NameSchema,
		agreeToTermsOfServiceAndPrivacyPolicy: z.boolean({
			required_error:
				'You must agree to the terms of service and privacy policy.',
		}),
		remember: z.boolean().optional(),
		redirectTo: z.string().optional(),
		password: PasswordSchema,
		confirm: PasswordSchema,
	})
	.superRefine(({ confirm, password }, ctx) => {
		if (confirm !== password) {
			ctx.addIssue({
				path: ['confirm'],
				code: 'custom',
				message: 'The passwords must match',
			})
		}
	})
