<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let id: string;
	export let placeholder = ''
	export let name: string
	export let type: string
	export let autofocus = false
	export let secondary = false
	export let value = ''
	export let required = false
	export let label = ''
	export let errors: string[] | null = null
	export let textArea = false
	export let style = ''

	const el = textArea ? 'textarea' : 'input'
	const errorId = `${id}-error`
	
	const dispatch = createEventDispatcher()
	function handleInput() {
		dispatch('input')
	}
</script>

{#if (label)}
	<label for={id}>{label}</label>
{/if}
<!-- svelte-ignore a11y-autofocus -->
<svelte:element
	this={el}
	{id}
	{placeholder}
	{name}
	{type}
	{autofocus}
	{value}
	{style}
	{required}
	class:secondary
	on:input={handleInput}
	class="base"
/>
<div id={errorId} class="error">
	{#if errors}
		<ul role="list">
			{#each errors as error}
				<li>{error}</li>
			{/each}
		</ul>
	{/if}
</div>


<style>
	.base {
		--background-color: var(--palette-secondary);
		--background-color-light: var(--palette-secondary-light);
		padding: var(--space-xs);
		border: var(--border);
		background-color: var(--background-color);
		border-radius: 1rem;
		outline: none;
		filter: drop-shadow(3px 3px 0px var(--palette-grey-20));

		transition: var(--animation-quick);
	}

	.base:focus-visible {
		background-color: var(--background-color-light);
		filter: drop-shadow(1px 1px 0px var(--palette-grey-20));
	}

	.base::placeholder {
		color: var(--palette-grey-20);
		opacity: 100%;
	}

	.secondary {
		--background-color: var(--palette-base);
		--background-color-light: var(--palette-base-light);
	}

	.error {
		color: var(--palette-primary);
		font-size: var(--type-step--1);
		margin-top: var(--space-3xs)
	}
</style>
