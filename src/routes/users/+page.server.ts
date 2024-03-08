import type { PageServerLoad, Actions } from './$types'
import { prisma } from '$utils/db.server'
import { z } from 'zod'
import { redirect } from '@sveltejs/kit'

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
})

const UserSearchResultsSchema = z.array(UserSearchResultSchema)

export const load: PageServerLoad = async ({ request }) => {
	console.log('server')
	const searchQuery = new URL(request.url).searchParams.get('search')
	console.log(searchQuery)
	if (searchQuery === '') {
		throw redirect(307, '/users')
	}

	const like = `%${searchQuery}%`

	const rawUsers = await prisma.$queryRaw`
		SELECT User.id, User.username, User.name
		FROM User
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
			searchQuery,
		} as const
	}

	return {
		status: 'idle',
		users: result.data,
		searchQuery,
	} as const
}
