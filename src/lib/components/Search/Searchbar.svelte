<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { Input, type OnSearch } from '$lib/components'
	import MagnifyingGlass from 'virtual:icons/radix-icons/magnifying-glass'

	export let searchQuery: string

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
	<button type="submit">
		<MagnifyingGlass />
	</button>
</form>

<style>
	.form {
		flex-direction: row;
	}

	button {
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
