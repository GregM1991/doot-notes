import type { ProviderName } from './connections'
import type { AuthProvider } from './providers/provider'

export const providers: Record<ProviderName, AuthProvider> = {
	github: new GitHubProvider(),
}

export function resolveConnectionData(
	providerName: ProviderName,
	providerId: string,
) {
	return providers[providerName].resolveConnectionData(providerId)
}
