import  { type VerificationTypes } from '$lib/auth/verify'

export const profileUpdateActionIntent = 'update-profile'
export const signOutOfSessionsActionIntent = 'sign-out-of-sessions'
export const deleteDataActionIntent = 'delete-data'

export const twoFAVerificationType = '2fa' satisfies VerificationTypes
export const twoFAVerifyVerificationType = '2fa-verify'
