import type { CookieSerializeOptions } from 'cookie'
import type { ProviderName } from '../../utils/connections'
// import { GitHubProvider } from '../../utils/providers/github.server'
import type { AuthProvider } from '../../utils/providers/provider'
import { decryptCookie, encryptAndSignCookieValue } from './secureCookie'
import type { Cookies } from '@sveltejs/kit'
import { ConnectionSchema } from '$lib/schemas'

export const connectionCookieName = 'dn_connection'
export const connectionOptionValues: CookieSerializeOptions & {
	path: string
} = {
	sameSite: 'lax' as const,
	path: '/',
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 60 * 10, // 10 minutes
}

export function getConnectionData(connectionCookie: string) {
	const decryptedConnectionValue = decryptCookie(connectionCookie)
	const parsedConnection = JSON.parse(decryptedConnectionValue)
	const connection = ConnectionSchema.safeParse(parsedConnection)

	return connection.success ? connection.data : undefined
}

export function setConnectionDataToCookie(cookies: Cookies, state: string) {
	const connectionValue = JSON.stringify({
		'oauth2:state': state,
	})
	const encryptedConnectionValue = encryptAndSignCookieValue(connectionValue)
	cookies.set(
		connectionCookieName,
		encryptedConnectionValue,
		connectionOptionValues,
	)
}

//  TODO: add providers back in: new GitHubProvider(),
// export const providers: Record<ProviderName, AuthProvider> = {
// 	github: new GitHubProvider(),
// }

// export function handleMockAction(providerName: ProviderName, cookies: Cookies) {
// 	return providers[providerName].handleMockAction(cookies)
// }

// export function resolveConnectionData(
// 	providerName: ProviderName,
// 	providerId: string,
// ) {
// 	return providers[providerName].resolveConnectionData(providerId)
// }
