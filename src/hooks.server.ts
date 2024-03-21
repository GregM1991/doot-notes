import { SESSION_SECRET } from '$env/static/private'
import { sequence } from '@sveltejs/kit/hooks'
import { handleSession } from 'svelte-kit-cookie-session'

export const toastSessionHandler = handleSession({
	key: 'dn_toast',
	secret: SESSION_SECRET,
	cookie: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	},
})

export const sessionHandler = handleSession({
	key: 'random_ass_cookie',
	secret: SESSION_SECRET,
	cookie: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: false,
	},
})

export const handle = sequence(
	toastSessionHandler,
	sessionHandler,
	({ resolve, event }) => {
		console.log(event.locals)
		return resolve(event)
	},
)
