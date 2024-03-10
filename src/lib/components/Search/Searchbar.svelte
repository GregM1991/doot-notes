<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import type { OnSearch } from '$lib/components'

	export let autofocus = false
	export let searchQuery = ''

	const dispatch = createEventDispatcher<{ search: OnSearch }>()
	let form: HTMLFormElement

	function onSearch() {
		dispatch('search', { form })
	}
</script>

<form bind:this={form} on:submit|preventDefault={onSearch}>
	<label class="sr-only" for="search">Search</label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		placeholder="Search"
		name="search"
		type="search"
		on:input={onSearch}
		{autofocus}
		value={searchQuery}
	/>
	<button type="submit">🔎</button>
</form>

<style>
	input {
		padding: var(--space-xs);
		border: 2px solid var(--palette-grey-20);
		background-color: var(--palette-secondary);
		border-radius: 1rem;
		outline: none;
		filter: drop-shadow(3px 3px 0px var(--palette-grey-20));

		transition: var(--animation-standard);
	}

	input:focus-visible {
		background-color: var(--palette-secondary-light);
		filter: drop-shadow(1px 1px 0px var(--palette-grey-20));
	}

	input::placeholder {
		color: var(--palette-grey-20);
		opacity: 100%;
	}

	button {
		padding: var(--space-xs);
		border: 2px solid var(--palette-grey-20);
		background-color: var(--palette-secondary);
		border-radius: 1rem;
		outline: none;
		filter: drop-shadow(3px 3px 0px var(--palette-grey-20));

		transition: var(--animation-standard);
	}
</style>
