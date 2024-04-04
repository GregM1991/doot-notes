import { RESEND_API_KEY } from '$env/static/private'
import { z } from 'zod'

const resendErrorSchema = z.union([
	z.object({
		name: z.string(),
		message: z.string(),
		statusCode: z.number(),
	}),
	z.object({
		name: z.literal('UnknownError'),
		message: z.literal('Unknown Error'),
		statusCode: z.literal(500),
		cause: z.any(),
	}),
])
type ResendError = z.infer<typeof resendErrorSchema>

const resendSuccessSchema = z.object({ id: z.string() })

type SendEmailParams = {
	to: string
	subject: string
	text: string
	html: string
}

export async function sendEmail(options: SendEmailParams) {
	const from = 'gregm31@live.com'

	const email = {
		from,
		...options,
	}
	console.log(JSON.stringify({ email }))

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
	const parsedData = resendSuccessSchema.safeParse(data)

	if (response.ok && parsedData.success) {
		return {
			status: 'success',
			data: parsedData,
		} as const
	} else {
		const parseResult = resendErrorSchema.safeParse(data)
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
