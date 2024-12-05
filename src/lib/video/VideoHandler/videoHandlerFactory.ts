// videoHandlerFactory.ts
import { BrowserVideoHandler } from './browserVideoHandler'

export class VideoHandlerFactory {
	private static isBrowser(): boolean {
		return typeof window !== 'undefined' && typeof document !== 'undefined'
	}

	static async create() {
		if (this.isBrowser()) {
			return new BrowserVideoHandler()
		} else {
			const { ServerVideoHandler } = await import('./serverVideoHandler.server')
			return new ServerVideoHandler()
		}
	}
}
