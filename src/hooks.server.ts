import { toastSessionHandler } from '$lib/server/sessions/toast'
import { sequence } from '@sveltejs/kit/hooks'

export const handle = sequence(toastSessionHandler, ({ resolve, event }) => {
	return resolve(event)
})
