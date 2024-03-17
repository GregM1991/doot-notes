import { dev } from '$app/environment'
import type { CookieSerializeOptions } from 'cookie'
import { SESSION_SECRET } from '$env/static/private'

interface ICookieSession {
	name: string
	options: CookieSerializeOptions & {
		path?: string
		secrets?: string[]
	}
}

export const toastSessionStorage: ICookieSession = {
	name: 'dn_toast',
	options: {
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secure: dev,
		secrets: SESSION_SECRET.split(','), // TODO: Figure out how to sign our cookies on the server
	},
}
