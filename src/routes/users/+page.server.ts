import type { PageServerLoad } from './$types'
import { prisma } from '$utils/db.server'
import { z } from 'zod'
import { json } from '@sveltejs/kit'

const UserSearchResultSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().nullable(),
})

const UserSearchResultsSchema = z.array(UserSearchResultSchema)

export const load: PageServerLoad = async ({ request }) => {
	/* TODO: search functionality

		- get search term from new URL's searchParams
		- if search term === '' redirect to /users

		- create raw query ($queryRaw) to select user id, username, name and 
			userimage id from user table
		- left join the user image on user id
		- where username is like the search query param
		- or name is like the search query param
		- order things by desceding (with inner select ⬇)
			- select updated at
			- from notes
			- where the notes owner id is equal to user id
			- order by updated at descending
			- limit 1
		- limit results to 50

		- safe parse the rawUsers through a user search results schema from zod
		- if there's no result, return json error with result.error.message and status 400
		- return json result.data
	*/
	const searchQuery = new URL(request.url).searchParams.get('search')
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
	console.log(result)
	if (!result.success) {
		return {
			status: 'error',
			error: result.error.message,
			statusCode: 400,
		} as const
	}

	return {
		status: 'idle',
		users: result.data,
	} as const
}
