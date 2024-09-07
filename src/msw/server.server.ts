import { setupServer } from 'msw/node'
import { handlers as resendHandlers } from './resend.server'

export const server = setupServer(...resendHandlers)
