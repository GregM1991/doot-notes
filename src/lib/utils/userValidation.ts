import { z } from 'zod'

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
