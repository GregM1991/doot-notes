import { getToastData, toastOptionValues } from '$lib/server/sessions/toast.js'

/** @type {import('@sveltejs/kit').LayoutServerLoad} */
export async function load({ cookies }) {
	const { name, options } = toastOptionValues

	const toastCookieString = cookies.get(name)
	if (!toastCookieString) return { toast: undefined }
	const toast = getToastData(toastCookieString)
	console.log('Layout Server: ', toast)
	if (toast && toast.flash) {
		cookies.delete(name, options)
	}

	return { toast }
}
