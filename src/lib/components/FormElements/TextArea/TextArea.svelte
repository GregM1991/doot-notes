<script lang="ts">
	import { ValidationErrors } from '$lib/components'
	import type { InputConstraint } from 'sveltekit-superforms'
	import { inputLabelTestId, validationTest } from '../formElements.consts'

	export let name: string
	export let value = ''
	export let label: string | null = null
	export let style: string | null = null
	export let errors: string[] | null = null
	export let constraints: InputConstraint | undefined = undefined
	export let secondary = false
	export let hidden = false
	export let fluid = false

	const id = name
</script>

{#if label && !hidden}
	<label data-testid={inputLabelTestId} for={id}>{label}</label>
{/if}
<textarea
	{id}
	{name}
	{style}
	{...constraints}
	bind:value
	class:secondary
	class:fluid
	class="base"
	aria-invalid={errors ? 'true' : undefined}
	{...$$restProps}
></textarea>

{#if !hidden}
	<ValidationErrors dataTestid={validationTest} {errors} errorId={id} />
{/if}

<style>
	.base {
		--stretch: var(--stretch);
		--background-color: var(--palette-secondary);
		--background-color-light: var(--palette-secondary-light);
		padding: var(--space-xs);
		border: var(--border);
		background-color: var(--background-color);
		border-radius: 1rem;
		outline: none;
		filter: var(--border-drop-shadow-black);
		justify-self: var(--stretch);
		flex: 1;

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
