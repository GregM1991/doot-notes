<script lang="ts">
	import { page } from '$app/stores'
	import {
		providerIconNamesMap,
		providerLabels,
		type ProviderName,
	} from '$lib/utils/connections'
	// import { SvelteComponent, onMount } from 'svelte'
	import Button from '../Button/Button.svelte'
	// import type { SvelteHTMLElements } from 'svelte/elements'

	export let redirectTo: string | null = null
	export let type: 'Connect' | 'Login' | 'Signup'
	export let providerName: ProviderName

	const label = providerLabels[providerName]
	const formAction = `/auth/${providerName}`
	// $: isPending = $page.form TODO: figure out how to hook this up with superforms

	// let lazyIcon: Promise<SvelteComponent<SvelteHTMLElements['svg']>> =
	// 	 import(
	// 		`virtual:icons/radix-icons/${providerIconNamesMap.get(providerName)}`
	// 	).then(module => module.default)

</script>

<form action={formAction} method="POST" class="wrapper">
	{#if redirectTo}
		<input type="hidden" name="redirectTo" value={redirectTo} />
	{/if}
	<Button fluid type="submit" secondary>
		<span class="flex">
			<!-- {#if lazyIcon}
				{#await lazyIcon then { default: ProviderIcon }}
					<ProviderIcon />
				{/await}
			{/if} -->
			<span>
				{type} with {label}
			</span>
		</span>
	</Button>
</form>

<style>
	.flex {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
	}
</style>
