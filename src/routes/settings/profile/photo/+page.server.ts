import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals, request, parent }) => {
	void requireUserId(locals.userId, request)
	const parentData = await parent()
	invariantResponse(parentData.user, 'User not found', 404)
	return { user: parentData.user }
}) satisfies PageServerLoad
