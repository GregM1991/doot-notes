import { z } from 'zod'
import type { Cookies } from '@sveltejs/kit'
import type { SuperValidated } from 'sveltekit-superforms'
import type { Message } from '$lib/types'
import type { twoFAVerifyVerificationType } from '$lib/profile/consts'

export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'
export const redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)

export const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
	[redirectToQueryParam]: z.string().optional(),
})

export type VerificationTypes = z.infer<typeof VerificationTypeSchema>
export type VerifyFunctionArgs = {
	cookies: Cookies
	request: Request
	userId?: string | null
	form: SuperValidated<
		z.input<typeof VerifySchema>,
		Message,
		z.output<typeof VerifySchema>
	>
	body: FormData | URLSearchParams
}
export type IsCodeValidParams = {
	code: string
	type: VerificationTypes | typeof twoFAVerifyVerificationType
	target: string
}
