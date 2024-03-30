import { z } from 'zod'

const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)

export type VerificationTypes = z.infer<typeof VerificationTypeSchema>
