<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import classnames from 'classnames'

	export let type: 'submit' | 'button' | 'reset' | undefined = undefined
	export let href: string | undefined = undefined
	// TODO: Need to make primary and secondary one prop as they can't be both
	export let variant: 'primary' | 'secondary' = 'primary'
	export let fluid = false
	export let style = ''
	export let small = false
	export let danger = false
	export let name: string | null = null
	export let value: string | null = null
	export let id: string | null = null
	export let form: string | null = null

	const classes = classnames({
		primary: variant === 'primary',
		secondary: variant === 'secondary',
		fluid,
		small,
		danger,
	})
	const element = href ? 'a' : 'button'
	const role = element === 'a' ? 'link' : 'button'

	const dispatch = createEventDispatcher()
	function onClick() {
		if (element === 'button') dispatch('click')
	}
</script>

<svelte:element
	this={element}
	{type}
	{href}
	{role}
	{style}
	{name}
	{value}
	{id}
	{form}
	class="base {classes}"
	on:click={onClick}
>
	<slot />
</svelte:element>

<style>
	.base {
		--padding: var(--space-xs);
		--font-size: var(--type-step-0);
		display: inline-flex;
		align-items: center;
		gap: var(--space-3xs);
		padding: var(--padding);
		background: var(--background);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		width: var(--width);
		font-size: var(--font-size);

		transition: var(--animation-quick);
	}

	.base:hover {
		filter: var(--border-drop-shadow-black-hover);
	}

	.base:focus {
		filter: var(--border-drop-shadow-black-hover);
		outline: none;
	}

	.base:active {
		filter: var(--border-drop-shadow-black-focus);
	}

	.primary {
		--background: var(--palette-secondary);
	}

	.secondary {
		--background: var(--palette-pop);
		color: white;
	}

	.danger {
		--background: tomato;
	}

	.small {
		--padding: var(--space-3xs) var(--space-2xs);
		--font-size: var(--type-step--1);
	}

	.fluid {
		--width: 100%;
		justify-content: center;
	}
</style>
