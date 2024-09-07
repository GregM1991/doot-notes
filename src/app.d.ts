// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare module 'svelte' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
	export interface ContextKey<T = unknown> {}

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
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
