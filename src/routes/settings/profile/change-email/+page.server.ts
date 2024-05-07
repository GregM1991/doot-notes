import { requireUserId } from '$lib/utils/auth.server'
import { superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { ChangeEmailSchema } from '$lib/profile/schemas'

export const load = (async ({ locals, request }) => {
	void requireUserId(locals.userId, request)
	const changeEmailForm = await superValidate(zod(ChangeEmailSchema))
	return { changeEmailForm }
}) satisfies PageServerLoad
