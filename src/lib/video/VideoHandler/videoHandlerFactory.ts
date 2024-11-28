import type { BaseVideoHandler } from './baseVideoHandler'
import { BrowserVideoHandler } from './browserVideoHandler'
import { ServerVideoHandler } from './serverVideoHandler.server'

export class VideoHandlerFactory {
	static create(): BaseVideoHandler {
		if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			return new BrowserVideoHandler()
		}
		return new ServerVideoHandler()
	}
}
