<script lang="ts">
	import classnames from 'classnames'
	import { Spinner } from '$lib/components'
	import { fly } from 'svelte/transition'
	import type { ButtonProps } from './types.button'

	let {
		children,
		dataAttr = {},
		danger = false,
		delayed = false,
		delayedReason = null,
		fluid = false,
		href = undefined,
		small = false,
		variant = 'primary',
		...restProps
	}: ButtonProps = $props()

	const classes = classnames({
		primary: variant === 'primary',
		secondary: variant === 'secondary',
		fluid,
		small,
		danger,
	})
	const element = href ? 'a' : 'button'
	const role = element === 'a' ? 'link' : 'button'
</script>

<svelte:element
	this={element}
	{...restProps}
	{...dataAttr}
	{role}
	{href}
	class="base {classes}"
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
			{@render children()}
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
