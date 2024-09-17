import type { Snippet } from 'svelte'

interface DataAttr {
	[key: `data-${string}`]: string
}

export type ButtonProps = {
	children: Snippet
	danger?: boolean
	dataAttr?: DataAttr
	delayed?: boolean
	delayedReason?: string | null
	fluid?: boolean
	form?: string | null
	href?: string
	id?: string | null
	name?: string | null
	onclick?: (event: MouseEvent) => void
	onkeyup?: (event: KeyboardEvent) => void
	onblur?: () => void
	requireDoubleCheck?: boolean
	small?: boolean
	style?: string
	type?: 'submit' | 'button' | 'reset'
	value?: string | null
	variant?: 'primary' | 'secondary'
}
