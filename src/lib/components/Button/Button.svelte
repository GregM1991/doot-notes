<script lang="ts">
	import { createEventDispatcher } from 'svelte'


	export let type: 'submit' | 'button' | 'reset' | undefined = undefined
	export let href: string | undefined = undefined
	// TODO: Need to make primary and secondary one prop as they can't be both
	export let primary = true
	export let secondary = false
	export let fluid = false
	export let style = ''
	export let small = false;
	export let danger = false;

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
	class="base"
	class:primary
	class:fluid
	class:secondary
	class:small
	class:danger
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
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

	.base:focus {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
		outline: none;
	}

	.base:active {
		filter: drop-shadow(1px 1px 0px var(--palette-grey-20));
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
	}
</style>
