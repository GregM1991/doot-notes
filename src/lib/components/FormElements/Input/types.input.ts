import type { InputConstraint } from 'sveltekit-superforms'

export type InputProps = {
	placeholder?: string
	name: string
	id?: string
	value: string
	label?: string
	style?: string
	errors?: string[] | null
	constraints?: InputConstraint | undefined
	secondary?: boolean
	required?: boolean
	fluid?: boolean
	hidden?: boolean
	onchange?: () => void
	type?: 'text' | 'password' | 'search' | 'hidden' | null
	oninput?: (
		event: Event & { currentTarget: EventTarget & HTMLInputElement },
	) => void
}
