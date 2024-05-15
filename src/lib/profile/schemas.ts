import { EmailSchema, PasswordSchema } from '$lib/utils/userValidation'
import { z } from 'zod'

const MAX_SIZE = 1024 * 1024 * 3 // 3MB

export const PhotoFormSchema = z.object({
	photoFile: z
		.instanceof(File)
		.refine(file => file.size > 0, 'Image is required')
		.refine(file => file.size <= MAX_SIZE, 'Image size must be less than 3MB'),
})

export const ChangePasswordForm = z
	.object({
		currentPassword: PasswordSchema,
		newPassword: PasswordSchema,
		confirmNewPassword: PasswordSchema,
	})
	.superRefine(({ confirmNewPassword, newPassword }, ctx) => {
		if (confirmNewPassword !== newPassword) {
			ctx.addIssue({
				path: ['confirmNewPassword'],
				code: z.ZodIssueCode.custom,
				message: 'The passwords must match',
			})
		}
	})

export const ChangeEmailSchema = z.object({
	email: EmailSchema,
})

export const CancelSchema = z.object({ intent: z.literal('cancel') })
export const VerifySchema = z.object({
	intent: z.union([z.literal('verify'), z.literal('cancel')]),
	code: z.string().min(6).max(6),
})
