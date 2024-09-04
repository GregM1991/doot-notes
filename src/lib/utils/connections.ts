import GithubLogo from 'virtual:icons/radix-icons/github-logo'
import { z } from 'zod'

export const GITHUB_PROVIDER_NAME = 'github'
export const GITHUB_PROVIDER_ICON_NAME = 'github-logo'
// to add another provider, set their name here and add it to the providerNames below

export const providerNames = [GITHUB_PROVIDER_NAME] as const
export const ProviderNameSchema = z.enum(providerNames)
export type ProviderName = z.infer<typeof ProviderNameSchema>

export const providerIconNamesMap = new Map([
	[GITHUB_PROVIDER_NAME, GITHUB_PROVIDER_ICON_NAME] as const,
])

export const providerLabels: Record<ProviderName, string> = {
	[GITHUB_PROVIDER_NAME]: 'GitHub',
} as const
