<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Input, MagnifyingGlass, Spinner, type OnSearch } from '$lib/components'

	export let searchQuery: string
	export let fetching = false

	const dispatch = createEventDispatcher<{ search: OnSearch }>()
	let form: HTMLFormElement

	function onSearch() {
		dispatch('search', { form })
	}
</script>

<form class="form" bind:this={form} on:submit|preventDefault={onSearch}>
	<label class="sr-only" for="search">Search</label>
	<Input
		on:input={onSearch}
		placeholder="Search"
		name="search"
		type="search"
		value={searchQuery.toString()}
		fluid
	/>
	<!-- TODO: Extract to icon button -->
	<button class="search-button" type="submit">
		{#if fetching}
			<Spinner color="var(--palette-tertiary-light)" />
		{:else}
			<MagnifyingGlass />
		{/if}
	</button>
</form>

<style>
	.form {
		flex-direction: row;
	}

	.search-button {
		display: inline-grid;
		place-items: center;
		padding: var(--space-xs);
		border: 2px solid var(--color-grey-20);
		background-color: var(--palette-tertiary);
		border-radius: 1rem;
		outline: none;
		filter: var(--border-drop-shadow-black);
		cursor: pointer;

		transition: var(--animation-quick);
	}

	button:focus {
		filter: var(--border-drop-shadow-black-hover);
	}

	button:hover {
		filter: var(--border-drop-shadow-black-hover);
	}

	button:active {
		filter: var(--border-drop-shadow-black-focus);
	}
</style>
