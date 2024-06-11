<script lang="ts">
	import { ValidationErrors } from '$lib/components'
	import { createEventDispatcher } from 'svelte'
	import type { InputConstraint } from 'sveltekit-superforms'

	export let placeholder = ''
	export let name: string
	export let id: string = name
	export let hidden = false
	export let value: string | null = ''
	export let label = ''
	export let style = ''
	export let errors: string[] | null = null
	export let constraints: InputConstraint | undefined = undefined
	export let autofocus = false
	export let secondary = false
	export let required = false
	export let fluid = false

	const dispatch = createEventDispatcher()
	function handleInput() {
		dispatch('input')
	}
</script>

{#if label}
	<label for={id}>{label}</label>
{/if}
<!-- svelte-ignore a11y-autofocus -->
<input
	{id}
	{placeholder}
	{name}
	{autofocus}
	{style}
	{required}
	bind:value
	{...constraints}
	class:fluid
	class:secondary
	class="base"
	on:input={handleInput}
	aria-invalid={errors ? 'true' : undefined}
	{...$$restProps} 
/>

{#if !hidden}
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
