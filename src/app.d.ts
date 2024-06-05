// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Message, Toast } from '$lib/types'
import type { HoneypotInputProps } from '$lib/server/honeypot'

declare module 'svelte' {
	export interface ContextKey<T = unknown> {} // eslint-disable-line @typescript-eslint/no-unused-vars

	export function getContext<T>(key: ContextKey<T>): T
	export function setContext<T>(key: ContextKey<T>, value: T): void
	export function hasContext<T>(key: ContextKey<T>): boolean
}

import 'unplugin-icons/types/svelte'
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userId: string | null
			toast: Toast | null
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
