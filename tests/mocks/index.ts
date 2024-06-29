import closeWithGrace from 'close-with-grace'
import { setupServer } from 'msw/node'
import { handlers as githubHandlers } from './github'
import { handlers as resendHandlers } from './resend'

export const server = setupServer(...resendHandlers, ...githubHandlers)

server.listen({ onUnhandledRequest: 'warn' })

if (process.env.NODE_ENV !== 'test') {
	console.info('🔶 Mock server installed')

	closeWithGrace(() => {
		server.close()
	})
}
