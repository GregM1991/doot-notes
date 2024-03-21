/** @type {import('@sveltejs/kit').LayoutServerLoad} */
export async function load({ locals }) {
	const toast = locals.dn_toast.data
	if (toast.flash) await locals.dn_toast.destroy()

	return {
		dn_toast: toast,
	}
}
