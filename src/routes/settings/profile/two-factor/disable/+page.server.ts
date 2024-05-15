import { requireRecentVerification } from '$lib/auth/verify.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ request, locals }) => {
	await requireRecentVerification(locals.userId, request)
	return {}
}) satisfies PageServerLoad
