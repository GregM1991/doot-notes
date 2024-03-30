import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { logout } from '$lib/utils/auth.server.js'

export const load = (async () => {
	return redirect(303, '/')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ cookies, locals }) => {
		locals.userId = null
		return logout(cookies)
	},
}
