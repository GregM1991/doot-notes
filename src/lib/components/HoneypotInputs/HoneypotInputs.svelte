<script lang="ts">
	import type { HoneypotInputProps } from '$lib/server/honeypot'
	import { getContext } from 'svelte'

	export let label = 'Please leave this field empty'

	const {
		nameFieldName = 'name__confirm',
		validFromFieldName = 'from__confirm',
		encryptedValidFrom,
	} = getContext<HoneypotInputProps>('honeyProps')
</script>

<div id={`${nameFieldName}_wrap`} aria-hidden="true" class="hidden">
	<label for={nameFieldName}>{label}</label>
	<input
		id={nameFieldName}
		name={nameFieldName}
		type="text"
		value=""
		autoComplete="nope"
		tabIndex={-1}
	/>
	{#if validFromFieldName && encryptedValidFrom}
		<label for={validFromFieldName}>{label}</label>
		<input
			id={validFromFieldName}
			name={validFromFieldName}
			type="text"
			value={encryptedValidFrom}
			readOnly
			autoComplete="off"
			tabIndex={-1}
		/>
	{/if}
</div>

<style>
	.hidden {
		display: none;
	}
</style>
