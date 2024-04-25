<script lang="ts">
	import { ValidationErrors } from '$lib/components'
	import { createEventDispatcher } from 'svelte'

	export let placeholder = ''
	export let name: string
	export let value = ''
	export let label = ''
	export let style = ''
	export let errors: string[] | null = null
	export let autofocus = false
	export let secondary = false
	export let required = false
	export let hidden = false

	const id = name

	const dispatch = createEventDispatcher()
	function handleInput() {
		dispatch('input')
	}
</script>

{#if label}
	<label for={id}>{label}</label>
{/if}
<!-- svelte-ignore a11y-autofocus -->
<textarea
	{id}
	{placeholder}
	{name}
	{autofocus}
	{style}
	{required}
	bind:value={value}
	class:secondary
	on:input={handleInput}
	class="base"
	aria-invalid={errors ? 'true' : undefined}
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
</style>
