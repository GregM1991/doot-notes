import {
	NameSchema,
	PasswordAndConfirmPasswordSchema,
	UsernameSchema,
} from '$lib/utils/userValidation'
import { z } from 'zod'

export const onboardingEmailSessionKey = 'onboardingEmail'

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
	})
	.and(PasswordAndConfirmPasswordSchema)

export const SignupFormInitialValueSchema = z.object({
	confirm: z.string().optional(),
	name: z.string().optional(),
	password: z.string().optional(),
	username: z.string().optional(),
})
