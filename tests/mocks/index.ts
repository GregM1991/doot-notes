import closeWithGrace from 'close-with-grace'
import { setupServer } from 'msw/node'
import { handlers } from './handlers/index'

const isTestEnvironment = process.env.NODE_ENV === 'test'
const isMockEnvironment = process.env.MOCK_SERVICES === 'true'

export const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'warn' })

if (isTestEnvironment || isMockEnvironment) {
	server.listen({
		onUnhandledRequest: isTestEnvironment ? 'error' : 'warn',
	})

	console.info(`🔶 Mock server running in ${process.env.NODE_ENV} mode`)

	closeWithGrace(() => {
		server.close()
	})
}
