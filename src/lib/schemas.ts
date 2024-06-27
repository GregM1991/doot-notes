import { z } from 'zod'
import {
	codeQueryParam,
	redirectToQueryParam,
	targetQueryParam,
	typeQueryParam,
} from './auth/verify'
import { createId as cuid } from '@paralleldrive/cuid2'

export const UsernameSchema = z
	.string({ required_error: 'Username is required' })
	.min(3, { message: 'Username is too short' })
	.max(20, { message: 'Username is too long' })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only include letters, numbers, and underscores',
	})
	.transform(value => value?.toLowerCase())

export const PasswordSchema = z
	.string({ required_error: 'Password is required' })
	.min(6, { message: 'Password is too short' })
	.max(100, { message: 'Password is too long' })

export const NameSchema = z
	.string({ required_error: 'Name is required' })
	.min(3, { message: 'Name is too short' })
	.max(40, { message: 'Name is too long' })

export const PasswordAndConfirmPasswordSchema = z.object({
	password: PasswordSchema,
	confirm: PasswordSchema,
})

export const EmailSchema = z
	.string({ required_error: 'Email is required' })
	.email({ message: 'Email is invalid' })
	.min(3, { message: 'Email is too short' })
	.max(100, { message: 'Email is too long' })
	// make sure to map email to lowercase
	.transform(value => value.toLowerCase())

export const UserNameOrEmailSchema = z
	.string({ required_error: 'Username/Email is required' })
	.min(3, { message: 'Username/Email is too short' })
	.max(100, { message: 'Username/Email is too long' })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message:
			'Username/Email can only include letters, numbers, and underscores',
	})
	.transform(value => value.toLowerCase())

export const ProfileFormSchema = z.object({
	name: NameSchema.optional().default(''),
	username: UsernameSchema,
})

export const OnboardingSchema = z
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

const verificationTypes = [
	'onboarding',
	'reset-password',
	'change-email',
	'2fa',
] as const
export const VerificationTypeSchema = z.enum(verificationTypes)

export const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
	[redirectToQueryParam]: z.string().optional(),
})

const titleMaxLength = 100
const titleMinLength = 1
const contentMaxLength = 10000
const contentMinLength = 1
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

export const ImageFieldsetSchema = z
	.object({
		id: z.string().optional(),
		file: z.instanceof(File).optional(),
		altText: z.string().optional().nullable(),
	})
	.refine(({ file }) => {
		return !file || file.size <= MAX_UPLOAD_SIZE
	}, 'File size must be less than 3MB')
export const ImageFieldsetListSchema = z.array(ImageFieldsetSchema)
export const NoteEditorSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
})

export const FullNoteEditorSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(titleMinLength).max(titleMaxLength),
	content: z.string().min(contentMinLength).max(contentMaxLength),
	images: z.array(ImageFieldsetSchema).max(5).optional(),
})

const MAX_SIZE = 1024 * 1024 * 3 // 3MB

export const PhotoFormSchema = z.object({
	photoFile: z
		.instanceof(File)
		.refine(file => file.size > 0, 'Image is required')
		.refine(file => file.size <= MAX_SIZE, 'Image size must be less than 3MB'),
})

export const ChangePasswordFormSchema = z
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
export const TwoFactorVerifySchema = z.object({
	intent: z.union([z.literal('verify'), z.literal('cancel')]),
	code: z.string().min(6).max(6),
})

export const ResendErrorSchema = z.union([
	z.object({
		name: z.string(),
		message: z.string(),
		statusCode: z.number(),
	}),
	z.object({
		name: z.literal('UnknownError'),
		message: z.literal('Unknown Error'),
		statusCode: z.literal(500),
		cause: z.any(),
	}),
])

export const ResendSuccessSchema = z.object({ id: z.string() })

export const AuthSessionSchema = z.object({
	sessionId: z.string(),
})

export const ConnectionSchema = z.object({
	'oauth2:state': z.string(),
})

export const EncryptedAndSignedCookieSchema = z.object({
	iv: z.string().length(32),
	cookieVal: z.string(),
})

export const toastTypes = ['message', 'success', 'error'] as const
export const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: z.enum(toastTypes).default('message'),
})

export const ForgotPasswordSchema = z.object({
	usernameOrEmail: UserNameOrEmailSchema,
})

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
	imageId: z.string().nullable(),
})

export const UserSearchResultsSchema = z.array(UserSearchResultSchema)

export const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember: z.boolean().optional(),
	redirectTo: z.string().optional(),
})

export const SignupFormSchema = z.object({
	email: z.string(),
})

export const ResetPasswordSchema = PasswordAndConfirmPasswordSchema
