export function forgotPasswordEmail({
	verifyUrl,
	otp,
}: {
	verifyUrl: string
	otp: string
}) {
	return `
	<!DOCTYPE PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>
	<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</head>
		<body>
			<h1>Doot doot! Here's the code to change your e-mail address</h1>
			<p>Use this verification code: <strong>${otp}</strong></p>
			<p>Or click the link to get started:</p>
			<p><a href="${verifyUrl}">${verifyUrl}</a></p>
		</body>
	</html>
	`
}
