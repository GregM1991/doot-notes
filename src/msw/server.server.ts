import { setupServer } from 'msw/node'
import { handlers as resendHandlers } from './resend.server.ts'

export const server = setupServer(...resendHandlers)
