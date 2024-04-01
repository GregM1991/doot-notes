type SendEmailParams = {
	to: string
	subject: string
	text: string
	html: string
}

export function sendEmail({ to, subject, html, text }: SendEmailParams) {
	const from = 'gregm31@live.com'

	const email = {}
}
