<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import classnames from 'classnames'
	import { Spinner } from '$lib/components'
	import { fly } from 'svelte/transition'

	export let type: 'submit' | 'button' | 'reset' | undefined = undefined
	export let href: string | undefined = undefined
	export let variant: 'primary' | 'secondary' = 'primary'
	export let fluid = false
	export let style = ''
	export let small = false
	export let danger = false
	export let name: string | null = null
	export let value: string | null = null
	export let id: string | null = null
	export let form: string | null = null
	export let delayed = false
	export let delayedReason: string | null = null

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
	{role}
	{style}
	{name}
	{value}
	{id}
	{form}
	{type}
	{href}
	class="base {classes}"
	on:click={onClick}
	disabled={delayed}
	aria-disabled={delayed ? 'true' : undefined}
>
	{#if delayed}
		<span transition:fly={{ y: 20, duration: 200 }} class="delayed-text">
			<Spinner
				color={variant === 'primary'
					? 'var(--palette-primary)'
					: 'var(--palette-secondary)'}
			/>
			{delayedReason}
		</span>
	{:else}
		<span class="delayed-text">
			<slot />
		</span>
	{/if}
</svelte:element>

<style>
	.base {
		--padding: var(--space-xs);
		--font-size: var(--type-step-0);
		--gap: var(--space-3xs);
		display: inline-flex;
		align-items: center;
		gap: var(--gap);
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

	.disabled {
		cursor: not-allowed;
	}

	.delayed-text {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
	}
</style>
