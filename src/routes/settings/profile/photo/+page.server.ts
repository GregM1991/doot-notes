import { requireUserId } from '$lib/utils/auth.server'
import { invariantResponse } from '$lib/utils/misc'
import { superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { NewImageSchema } from '$lib/profile/schemas'

export const load = (async ({ locals, request, parent }) => {
	void requireUserId(locals.userId, request)

	const parentData = await parent()
	invariantResponse(parentData.user, 'User not found', 404)

	const user = {
		id: parentData.user.id,
		name: parentData.user.name,
		username: parentData.user.username,
		image: parentData.user.image,
	}

	return { user, form: await superValidate(zod(NewImageSchema)) }
}) satisfies PageServerLoad
