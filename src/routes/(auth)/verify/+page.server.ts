import { prisma } from '$lib/utils/db.server'
import { parseWithZod } from '@conform-to/zod'
import { fail, type Actions } from '@sveltejs/kit'
import { z } from 'zod'

export const _codeQueryParam = 'code'
export const _targetQueryParam = 'target'
export const _typeQueryParam = 'type'
export const _redirectToQueryParam = 'redirectTo'
const types = ['onboarding', 'reset-password', 'change-email', '2fa'] as const
const VerificationTypeSchema = z.enum(types)

export type VerificationTypes = z.infer<typeof VerificationTypeSchema>
type IsCodeValidParams = {
  code: string,
  type: typeof VerificationTypeSchema,
  target: string
}
/* 
Create VerifySchema
  codeQueryParam: string min max 6
  typeQueryParam: VerificationTypeSchema
  targetQueryParam: string
  redirectToQueryParam: optional string
*/
const VerifySchema = z.object({
	[_codeQueryParam]: z.string().min(6).max(6),
	[_typeQueryParam]: VerificationTypeSchema,
	[_targetQueryParam]: z.string(),
	[_redirectToQueryParam]: z.string().optional(),
})

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData()
		// TODO: honeypot
	},
} satisfies Actions

async function validateRequest(
	request: Request,
	body: FormData | URLSearchParams,
) {
	const submission = await parseWithZod(body, {
		schema: VerifySchema.superRefine(async (data, ctx) => {
			const codeIsValid = await isCodeValid({
				code: data[_codeQueryParam],
				type: data[_typeQueryParam],
				target: data[_targetQueryParam],
			})
			if (!codeIsValid) {
				ctx.addIssue({
					path: ['code'],
					code: z.ZodIssueCode.custom,
					message: `Invalid code`,
				})
				return
			}
		}),
		async: true,
	})

	if (submission.status !== 'success') {
		return fail(submission.status === 'error' ? 400 : 200, {
			result: submission.reply(),
		})
	}

  // ensurePrimary ~~~ This has to do with caching with fly.io I believe

  const { value: submissionValue } = submission

  async function deleteVerification() {
    await prisma.verification.delete({
      where: {
        target_type: {
          type: submissionValue[_typeQueryParam],
          target: submissionValue[_targetQueryParam]
        }
      }
    })
  }

  switch (submissionValue[_typeQueryParam]) {
    // case 'reset-password': {
    //   await deleteVerification()
    //   return handleResetPasswordVerification({ request, body, submission })
    // }
    case 'onboarding': {
      await deleteVerification()
      return handleOnboardingVerification({ request, body, submission})
    }
    // case 'change-email': {
    //   await deleteVerification()
    //   return handleChangeEmailVerification({ request, body, submission})
    // }
    // case '2fa': {
    //   await deleteVerification()
    //   return handleLoginTwoFactorVerification({ request, body, submission})
    // }
  }
}

async function isCodeValid({
  code,
  type,
  target
}: IsCodeValidParams) {

}
