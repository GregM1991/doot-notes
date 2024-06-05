import { resolveConnectionData } from '$lib/server/sessions/connections.server'
import { requireUserId } from '$lib/utils/auth.server'
import { ProviderNameSchema, type ProviderName } from '$lib/utils/connections'
import { prisma } from '$lib/utils/db.server'
import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { invariantResponse, setToast } from '$lib/utils/misc'

async function userCanDeleteConnections(userId: string) {
	const user = await prisma.user.findUnique({
		select: {
			password: { select: { userId: true } },
			_count: { select: { connections: true } },
		},
		where: { id: userId },
	})
	// user can delete their connections if they have a password
	if (user?.password) return true
	// users have to have more than one remaining connection to delete one
	return Boolean(user?._count.connections && user?._count.connections > 1)
}

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

	return {
		connections,
		canDeleteConnections: await userCanDeleteConnections(userId),
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const userId = requireUserId(locals.userId, request)
		const formData = await request.formData()
		invariantResponse(
			formData.get('intent') === 'delete-connection',
			'Invalid intent',
		)
		invariantResponse(
			await userCanDeleteConnections(userId),
			'You cannot delete your last connection unless you have a password.',
		)
		const connectionId = formData.get('connectionId')
		invariantResponse(typeof connectionId === 'string', 'Invalid connectionId')
		await prisma.connection.delete({
			where: {
				id: connectionId,
				userId: userId,
			},
		})
		locals.toast = setToast({
			title: 'Deleted',
			description: 'Your connection has been deleted.',
		})
		return {
			status: 'success',
		}
	},
} satisfies Actions
