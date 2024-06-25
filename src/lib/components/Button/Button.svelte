<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import classnames from 'classnames'
	import Spinner from '../Spinner/Spinner.svelte'
	import { fly } from 'svelte/transition'

	export let variant: 'primary' | 'secondary' = 'primary'
	export let fluid = false
	export let style = ''
	export let small = false
	export let danger = false
	export let delayed = false
	export let delayedReason: string | null = null

	$: classes = classnames({
		primary: variant === 'primary',
		secondary: variant === 'secondary',
		fluid,
		small,
		danger,
		disabled: delayed,
	})

	const element = $$restProps.href ? 'a' : 'button'
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
	class="base {classes}"
	on:click={onClick}
	disabled={delayed}
	aria-disabled={delayed ? 'true' : undefined}
	{...$$restProps}
>
	{#if delayed}
		<span transition:fly={{ y: 40, duration: 300 }} class="delayed-text">
			{delayedReason}
			<Spinner
				color={variant === 'primary'
					? 'var(--palette-primary)'
					: 'var(--palette-secondary)'}
			/>
		</span>
	{:else}
		<slot />
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
		--gap: var(--space-2xs);
		cursor: not-allowed;
	}
</style>
