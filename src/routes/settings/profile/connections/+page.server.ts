import { resolveConnectionData } from '$lib/server/sessions/connections.server'
import { requireUserId } from '$lib/utils/auth.server'
import { ProviderNameSchema, type ProviderName } from '$lib/utils/connections'
import { prisma } from '$lib/utils/db.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	// const timings = makeTimings('profile connections loader')
	const rawConnections = await prisma.connection.findMany({
		select: { id: true, providerName: true, providerId: true, createdAt: true },
		where: { userId },
	})
	const connections: Array<{
		providerName: ProviderName
		id: string
		displayName: string
		link?: string | null
		createdAtFormatted: string
	}> = []
	for (const connection of rawConnections) {
		const r = ProviderNameSchema.safeParse(connection.providerName)
		if (!r.success) continue
		const providerName = r.data
		const connectionData = await resolveConnectionData(
			providerName,
			connection.providerId,
		)
		connections.push({
			...connectionData,
			providerName,
			id: connection.id,
			createdAtFormatted: connection.createdAt.toLocaleString(),
		})
	}
}) satisfies PageServerLoad
