import closeWithGrace from 'close-with-grace'
import { setupServer } from 'msw/node'
import { handlers as resendHandlers } from './resend.ts'

export const server = setupServer(...resendHandlers)

server.listen({ onUnhandledRequest: 'warn' })

if (process.env.NODE_ENV !== 'test') {
	console.info('🧑‍🤝‍🧑 Mock server up and running')

	closeWithGrace(() => {
		server.close()
	})
}
