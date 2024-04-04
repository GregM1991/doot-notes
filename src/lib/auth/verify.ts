import { z } from 'zod'
import { type Submission } from '@conform-to/dom'
import type { Cookies } from '@sveltejs/kit'

export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'
export const redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)

export type VerificationTypes = z.infer<typeof VerificationTypeSchema>
export type VerifyFunctionArgs = {
	cookies: Cookies
	request: Request
	submission: Submission<
		z.input<typeof VerifySchema>,
		string[],
		z.output<typeof VerifySchema>
	>
	body: FormData | URLSearchParams
}
export type IsCodeValidParams = {
	code: string
	type: VerificationTypes
	target: string
}

export const VerifySchema = z.object({
	[codeQueryParam]: z.string().min(6).max(6),
	[typeQueryParam]: VerificationTypeSchema,
	[targetQueryParam]: z.string(),
	[redirectToQueryParam]: z.string().optional(),
})
