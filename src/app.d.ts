// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session } from 'svelte-kit-cookie-session'

type ToastSessionData = {
	flash: boolean
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
			dn_toast: Session<ToastSessionData>
		}
		interface PageData {
			dn_toast: ToastSessionData
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
