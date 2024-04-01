import { RESEND_API_KEY } from '$env/static/private'
import { z } from 'zod'

const ResendSuccessSchema = z.object({
	email: z.string(),
})
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

	// Haven't set up resend API
	// check for RESEND_API_KEY in env && env isn't mocks
	// console.error out RESEND_API_KEY needs to be set
	// console.error need for RESEND_API_KEY being set in environment var
	// console.error out Would have sent following email: JSON.stringify(email)
	if (RESEND_API_KEY && !process.env.MOCKS) {
		console.error('RESEND_API_KEY needs to be set')
		console.error('RESEND_API_KEY needs to be in environment variables')
		console.error(
			'The following email would have been sent:',
			JSON.stringify(email),
		)
		return {
			status: 'success',
			data: { id: 'mocked' },
		} as const
	}

	// make fetch to 'https://api.resend.com/emails'
	// method POST
	// body is stringified email
	// headers
	// Authorizatoin: Bearer RESEND_API_KEY
	// Content-Type: application/json
	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		body: JSON.stringify(email),
		headers: {
			Authorization: `Bearer ${RESEND_API_KEY}`,
			ContentType: 'application/json',
		},
	})

	// await data.json() call
	// parsedData = ResendSuccessSchema.safeParse(data)
	const data = await response.json()
	const parsedData = ResendSuccessSchema.safeParse(data)

	// If the response is ok && parsedData is success
	// return object with status: 'success' and data: parsedData

	// else
	// parseResult = ResendErrorSchema.safeParse(data)
	// if the parseResult is a success
	// return status of error and error as parseResult.data

	// else
	// return status: 'error'
	// error:
	// name: 'UnknownError'
	// message: 'Unknown Error',
	// statusCode :500
	// cause: data
	// make sure it stisfies ResendError
	// type as const
}

sendEmail({ to: 'thing', subject: 'thing', text: 'string', html: 'string' })
