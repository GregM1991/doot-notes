import { UserSearchResultsSchema } from '$lib/schemas'
import { prisma } from '$lib/utils/db.server'
import type { PageServerLoad } from './$types'

export const load = (async ({ url }) => {
	await new Promise(resolve => setTimeout(resolve, 1000))
	const searchQuery = url.searchParams.get('search') ?? ''
	const like = `%${searchQuery ?? ''}%`

	const rawUsers = await prisma.$queryRaw`
		SELECT User.id, User.username, User.name, UserImage.id AS imageId
		FROM User
		LEFT JOIN UserImage ON User.id = UserImage.userId
		WHERE User.username LIKE ${like}
		OR User.name LIKE ${like}
		ORDER BY (
			SELECT Note.updatedAt
			FROM Note
			WHERE Note.ownerId = User.id
			ORDER BY Note.updatedAt DESC
			LIMIT 1
		) DESC
		LIMIT 50
	`

	const result = UserSearchResultsSchema.safeParse(rawUsers)
	if (!result.success) {
		return {
			status: 'error',
			error: result.error.message,
			statusCode: 400,
			fetching: false,
		} as const
	}

	return {
		status: 'idle',
		users: result.data,
		fetching: false,
	} as const
}) satisfies PageServerLoad
