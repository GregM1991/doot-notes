<script lang="ts">
	import { ValidationErrors } from '$lib/components'
	import type { InputConstraint } from 'sveltekit-superforms'
	import { inputLabelTestId } from './input.test'

	export let placeholder = ''
	export let name: string
	export let id: string = name
	export let value: string | null = ''
	export let label: string | null = null
	export let style: string | null = null
	export let errors: string[] | null = null
	export let constraints: InputConstraint | undefined = undefined
	export let secondary = false
	export let required = false
	export let fluid = false

	const type = $$restProps.type
</script>

{#if label}
	<label data-testid={inputLabelTestId} for={id}>{label}</label>
{/if}
<input
	{id}
	{placeholder}
	{name}
	{style}
	{required}
	bind:value
	class="base {fluid ? 'fluid' : ''} {secondary ? 'secondary' : ''}"
	aria-invalid={errors ? 'true' : undefined}
	{...constraints}
	{...$$restProps}
/>

{#if type === 'hidden'}
	<ValidationErrors {errors} errorId={id} />
{/if}

<style>
	.base {
		--background-color: var(--palette-secondary);
		--background-color-light: var(--palette-secondary-light);
		padding: var(--space-xs);
		border: var(--border);
		background-color: var(--background-color);
		border-radius: 1rem;
		outline: none;
		filter: var(--border-drop-shadow-black);
		width: var(--width);

		transition: var(--animation-quick);
	}

	.base:focus-visible {
		background-color: var(--background-color-light);
		filter: var(--border-drop-shadow-black-focus);
	}

	.base::placeholder {
		color: var(--color-grey-20);
		opacity: 100%;
	}

	.secondary {
		--background-color: var(--palette-base);
		--background-color-light: var(--palette-base-light);
	}

	.fluid {
		--width: 100%;
		justify-content: center;
	}
</style>
