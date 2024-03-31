import { z } from 'zod'

export const _codeQueryParam = 'code'
export const _targetQueryParam = 'target'
export const _typeQueryParam = 'type'
export const _redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)

export type VerificationTypes = z.infer<typeof VerificationTypeSchema>
