import { type Cookies } from '@sveltejs/kit'
import { type Strategy } from 'remix-auth'

// Define a user type for cleaner typing
export type ProviderUser = {
	id: string
	email: string
	username?: string
	name?: string
	imageUrl?: string
}

export interface AuthProvider {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getAuthStrategy(): Strategy<ProviderUser, any>
	handleMockAction(cookies: Cookies): Promise<void>
	resolveConnectionData(providerId: string): Promise<{
		displayName: string
		link?: string | null
	}>
}
