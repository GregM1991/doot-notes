<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let href: string | undefined = undefined
	export let customStyles: Record<string, string> | undefined = undefined
	export let primary: boolean = true
	export let secondary: boolean = false
	export let fluid = false

	// TODO: Test this works...
	function styleSpreader(style: Record<string, string>) {
		console.log(style)
		return undefined
	}
	const style = customStyles ? styleSpreader(customStyles) : undefined

	const type = href ? 'a' : 'button'
	const role = type === 'a' ? 'link' : 'button'

	const dispatch = createEventDispatcher()
	function onClick() {
		dispatch('click')
	}
</script>

<svelte:element
	this={type}
	on:click={onClick}
	class="base"
	{href}
	class:primary
	class:fluid
	class:secondary
	{style}
	{role}
>
	<slot />
</svelte:element>

<style>
	.base {
		padding: var(--space-xs);
		background: var(--link-background);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		display: inline-block;
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
