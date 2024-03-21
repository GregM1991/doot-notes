// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session } from 'svelte-kit-cookie-session'

type SessionData = {
	views: number
}
type ToastSessionData = {
	description: string
	id: string
	title: string
	type: 'message' | 'success' | 'error'
}

import 'unplugin-icons/types/svelte'
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session<SessionData>
			toastSession: Session<ToastSessionData>
		}
		interface PageData {
			session: SessionData
			toastSession: ToastSessionData
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
