import type { InputConstraint } from 'sveltekit-superforms'

export type InputProps = {
	autofocus?: boolean
	constraints?: InputConstraint | undefined
	errors?: string[] | null
	fluid?: boolean
	hidden?: boolean
	id?: string
	label?: string
	name: string
	onchange?: () => void
	oninput?: (
		event: Event & { currentTarget: EventTarget & HTMLInputElement },
	) => void
	placeholder?: string
	required?: boolean
	secondary?: boolean
	style?: string
	type?: 'text' | 'password' | 'search' | 'hidden' | 'email' | null
	value: string
}
