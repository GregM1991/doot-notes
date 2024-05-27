// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Message } from '$lib/types'

import 'unplugin-icons/types/svelte'
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userId: string | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			Message
		}
	}
}

export {}
