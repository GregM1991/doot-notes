import { getToastData, toastOptionValues } from '$lib/server/sessions/toast.js'

/** @type {import('@sveltejs/kit').LayoutServerLoad} */
export async function load({ cookies }) {
	const { name, options } = toastOptionValues

	const toastCookieString = cookies.get(name)
	if (!toastCookieString) return { toast: undefined }
	const toast = getToastData(toastCookieString)

	if (toast && toast.flash) {
		cookies.delete('dn_toast', options)
	}

	return { toast }
}
