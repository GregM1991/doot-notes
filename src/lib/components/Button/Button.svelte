<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let href: string | undefined = undefined
	export let primary = true
	export let secondary = false
	export let fluid = false
	export let style = ''

	const type = href ? 'a' : 'button'
	const role = type === 'a' ? 'link' : 'button'

	const dispatch = createEventDispatcher()
	function onClick() {
		if (type === 'button') dispatch('click')
	}
</script>

<svelte:element
	this={type}
	{href}
	{role}
	{style}
	class="base"
	class:primary
	class:fluid
	class:secondary
	on:click={onClick}
>
	<slot />
</svelte:element>

<style>
	.base {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3xs);
		padding: var(--space-xs);
		background: var(--link-background);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		width: var(--link-width);

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
		--link-background: var(--palette-secondary);
	}

	.secondary {
		--link-background: var(--palette-pop);
		color: white;
	}

	.fluid {
		--link-width: 100%;
	}
</style>
