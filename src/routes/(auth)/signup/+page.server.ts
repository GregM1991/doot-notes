import { sendEmail } from '$lib/server/email'
import { prepareVerification } from '$lib/server/verify'
import { prisma } from '$lib/utils/db.server.js'
import { parseWithZod } from '@conform-to/zod'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const SignupFormSchema = z.object({
	email: z.string(),
})

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		// TODO: Create honeypot

		const submission = await parseWithZod(formData, {
			schema: SignupFormSchema.superRefine(async (data, ctx) => {
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email },
          select: { id: true }
        })
        if (existingUser) {
          ctx.addIssue({
            path: ['email'],
            code: z.ZodIssueCode.custom,
            message: 'A user already exists with this email'
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

    const {email} = submission.value
    const { verifyUrl, redirectTo, otp } = await prepareVerification({
      period: 10 * 60,
      request,
      type: 'onboarding',
      target: email
    })

    const response = await sendEmail({
      to: email,
      subject: `Let's get Dootin!`,
      html: 'Shit, how do I do this without React email thing',
      text: 'Whats this also?'
    })

    if (response.status === 'success') {
      return redirect(303, redirectTo.toString())
    } else {
      fail(500, { submission.reply({formErrors: [response.error.message]})})
    }

		// return handleNewSession({
		// 	cookies,
		// 	session,
		// 	remember: remember ?? false,
		// 	redirectTo: redirectTo ? redirectTo : null,
		// })
	},
}
