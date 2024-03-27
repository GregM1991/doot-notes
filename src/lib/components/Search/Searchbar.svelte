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

<form bind:this={form} on:submit|preventDefault={onSearch}>
	<label class="sr-only" for="search">Search</label>
	<Input
		id="search"
		on:input={onSearch}
		placeholder="Search"
		name="search"
		type="search"
		value={searchQuery.toString()}
	/>
	<!-- TODO: Extract to icon button -->
	<button type="submit">
		<MagnifyingGlass />
	</button>
</form>

<style>
	form {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
	}

	button {
		display: inline-grid;
		place-items: center;
		padding: var(--space-xs);
		border: 2px solid var(--color-grey-20);
		background-color: var(--palette-tertiary);
		border-radius: 1rem;
		outline: none;
		filter: drop-shadow(3px 3px 0px var(--color-grey-20));
		cursor: pointer;

		transition: var(--animation-quick);
	}

	button:focus {
		filter: drop-shadow(5px 5px 0px var(--color-grey-20));
	}

	button:hover {
		filter: drop-shadow(5px 5px 0px var(--color-grey-20));
	}

	button:active {
		filter: drop-shadow(1px 1px 0px var(--color-grey-20));
	}
</style>
