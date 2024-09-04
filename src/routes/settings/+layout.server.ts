import { redirect } from '@sveltejs/kit'
import  { type LayoutServerLoad } from './$types'
import { createLoginWithRedirectUrl } from '$lib/utils/auth.server'

export const load = (async ({ parent, request }) => {
	const { user } = await parent()
	if (!user) {
		const loginRedirect = createLoginWithRedirectUrl(request, request.url)
		return redirect(302, loginRedirect)
	}
	return { user }
}) satisfies LayoutServerLoad
