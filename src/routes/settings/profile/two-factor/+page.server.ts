import { twoFAVerificationType } from '$lib/profile/consts'
import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ request, locals }) => {
	const userId = await requireUserId(locals.userId, request)
	const verification = await prisma.verification.findUnique({
		where: { target_type: { type: twoFAVerificationType, target: userId } },
		select: { id: true },
	})
	return { isTwoFactorEnabled: Boolean(verification) }
}) satisfies PageServerLoad
