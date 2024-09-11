import type { Snippet } from 'svelte'

export type ButtonProps = {
	type?: 'submit' | 'button' | 'reset'
	href?: string
	variant?: 'primary' | 'secondary'
	fluid?: boolean
	style?: string
	small?: boolean
	danger?: boolean
	name?: string | null
	value?: string | null
	id?: string | null
	form?: string | null
	delayed?: boolean
	delayedReason?: string | null
	class?: string
	children: Snippet
	onclick?: (event: MouseEvent) => void
}
