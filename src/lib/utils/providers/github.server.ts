// import { createId as cuid } from '@paralleldrive/cuid2'
// import { env } from '$env/dynamic/private'
// import { GitHubStrategy } from 'remix-auth-github'
// import { z } from 'zod'
// import { cache, cachified } from '../cache.server.ts'
// import { type AuthProvider } from './provider.ts'
// import { redirect, type Cookies } from '@sveltejs/kit'
// import { setConnectionDataToCookie } from '$lib/server/sessions/connections.server.ts'

// const GitHubUserSchema = z.object({ login: z.string() })
// const GitHubUserParseResult = z
// 	.object({
// 		success: z.literal(true),
// 		data: GitHubUserSchema,
// 	})
// 	.or(
// 		z.object({
// 			success: z.literal(false),
// 		}),
// 	)

// const shouldMock = process.env.GITHUB_CLIENT_ID?.startsWith('MOCK_')

// export class GitHubProvider implements AuthProvider {
// 	getAuthStrategy() {
// 		if (!env.GITHUB_CLIENT_SECRET || !env.GITHUB_CLIENT_ID) {
// 			throw new Error('Missing env.GITHUB_CLIENT_ID')
// 		}
// 		return new GitHubStrategy(
// 			{
// 				clientId: env.GITHUB_CLIENT_ID,
// 				clientSecret: env.GITHUB_CLIENT_SECRET,
// 				redirectURI: '/auth/github/callback',
// 			},
// 			async ({ profile }) => {
// 				const email = profile.emails[0].value.trim().toLowerCase()
// 				const username = profile.displayName
// 				const imageUrl = profile.photos[0].value
// 				return {
// 					email,
// 					id: profile.id,
// 					username,
// 					name: profile.name.givenName,
// 					imageUrl,
// 				}
// 			},
// 		)
// 	}

// 	async resolveConnectionData(providerId: string) {
// 		const result = await cachified({
// 			key: `connection-data:github:${providerId}`,
// 			cache,
// 			ttl: 1000 * 60,
// 			swr: 1000 * 60 * 60 * 24 * 7,
// 			async getFreshValue(context) {
// 				const response = await fetch(
// 					`https://api.github.com/user/${providerId}`,
// 					{ headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } },
// 				)
// 				const rawJson = await response.json()
// 				const result = GitHubUserSchema.safeParse(rawJson)
// 				if (!result.success) {
// 					// if it was unsuccessful, then we should kick it out of the cache
// 					// asap and try again.
// 					context.metadata.ttl = 0
// 				}
// 				return result
// 			},
// 			checkValue: GitHubUserParseResult,
// 		})
// 		return {
// 			displayName: result.success ? result.data.login : 'Unknown',
// 			link: result.success ? `https://github.com/${result.data.login}` : null,
// 		} as const
// 	}

// 	async handleMockAction(cookies: Cookies) {
// 		if (!shouldMock) return
// 		const state = cuid()
// 		setConnectionDataToCookie(cookies, state)
// 		const code = 'MOCK_CODE_GITHUB_KODY'
// 		const searchParams = new URLSearchParams({ code, state })
// 		throw redirect(303, `/auth/github/callback?${searchParams}`)
// 	}
// }
