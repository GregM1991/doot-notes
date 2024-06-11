import { z } from 'zod'
import type { Cookies } from '@sveltejs/kit'
import type { SuperValidated } from 'sveltekit-superforms'
import type { Message } from '$lib/types'
import type { twoFAVerifyVerificationType } from '$lib/profile/consts'
import type { VerificationTypeSchema, VerifySchema } from '$lib/schemas'

export const codeQueryParam = 'code'
export const targetQueryParam = 'target'
export const typeQueryParam = 'type'
export const redirectToQueryParam = 'redirectTo'

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
