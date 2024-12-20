import { githubHandlers } from './github.handlers'
import { resendHandlers } from './resend.handlers'
import { createVideoHandlers } from './video.handlers'

export const handlers = [
	...githubHandlers,
	...resendHandlers,
	...createVideoHandlers(),
]

export type AppHandlers = typeof handlers
