/** @type {import('@sveltejs/kit').LayoutServerLoad} */
export function load({ locals }) {
	return {
		dn_toast: locals.dn_toast.data,
	}
}
