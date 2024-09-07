import { redirect } from '@sveltejs/kit'
import { createLoginWithRedirectUrl } from '$lib/utils/auth.server'
import type { LayoutServerLoad } from './$types'

export const load = (async ({ parent, request }) => {
	const { user } = await parent()
	if (!user) {
		const loginRedirect = createLoginWithRedirectUrl(request, request.url)
		return redirect(302, loginRedirect)
	}
	return { user }
}) satisfies LayoutServerLoad
