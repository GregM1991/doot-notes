import { RESEND_API_KEY } from '$env/static/private'
import { ResendSuccessSchema, ResendErrorSchema } from '$lib/schemas'
import { z } from 'zod'

type ResendError = z.infer<typeof ResendErrorSchema>

type SendEmailArgs = {
	to: string
	subject: string
	text: string
	html: string
}

export async function sendEmail(options: SendEmailArgs) {
	const from = 'onboarding@resend.dev'

	const email = {
		from,
		...options,
	}

	if (!RESEND_API_KEY && !process.env.MOCKS) {
		console.error(`RESEND_API_KEY needs to be set and we're`)
		console.error(`RESEND_API_KEY needs to be in environment variables`)
		console.error(
			`Would have sent the following email: `,
			JSON.stringify(email),
		)
		return {
			status: 'success',
			data: { id: 'mocked' },
		} as const
	}
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		body: JSON.stringify(email),
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
	})
	const data = await response.json()
	const parsedData = ResendSuccessSchema.safeParse(data)

	if (response.ok && parsedData.success) {
		return {
			status: 'success',
			data: parsedData,
		} as const
	} else {
		const parseResult = ResendErrorSchema.safeParse(data)
		if (parseResult.success) {
			return {
				status: 'error',
				error: parseResult.data,
			} as const
		} else {
			return {
				status: 'error',
				error: {
					name: 'UnknownError',
					message: 'Unknown Error',
					statusCode: 500,
					cause: data,
				} satisfies ResendError,
			} as const
		}
	}
}
