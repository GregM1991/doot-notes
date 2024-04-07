import type { PageServerLoad } from './$types'

export const load = (async () => {
	// Need to grab the email of the user being onboarded from the request ~~ Do this with a helper function requireOnboardingEmail(request)
	const { email } = requireOnboardingEmail(request)
	// return the email
}) satisfies PageServerLoad

async function requireOboardingEmail(request: Request) {
	// Require anonymous ~~ Do this with requireAnonymous(request)
	// get the email from the verifySession cookie we set on the verify page
	// if the type of the email does NOT equal string, OR, there is no email
	// throw a redirect to /signup
	// return the email
}