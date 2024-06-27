<script lang="ts">
	import { ValidationErrors } from '$lib/components'
	import classNames from 'classnames'
	import { inputLabelTestId, validationTest } from '../formElements.consts'
	import type { InputProps } from './types.input'

	let {
		label,
		errors = null,
		constraints = undefined,
		secondary = false,
		fluid = false,
		value = $bindable(''),
		oninput,
		...restProps
	}: InputProps = $props()

	const classes = classNames({
		base: true,
		secondary,
		fluid,
	})
	const id = restProps.id ?? restProps.name
</script>

{#if label}
	<label data-testid={inputLabelTestId} for={id}>{label}</label>
{/if}
<input
	{id}
	bind:value
	class={classes}
	aria-invalid={errors ? 'true' : undefined}
	oninput={(event) => oninput ? oninput(event) : null}
	{...constraints}
	{...restProps}
/>

{#if restProps.type !== 'hidden'}
	<ValidationErrors dataTestid={validationTest} {errors} errorId={id} />
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
