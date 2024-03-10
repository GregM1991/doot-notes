<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { type OnSearch, Icon } from '$lib/components'
	import MagnifyingGlass from 'virtual:icons/radix-icons/magnifying-glass'
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
	<button type="submit">
		<MagnifyingGlass />
	</button>
</form>

<style>
	form {
		display: flex;
		align-items: center;
		gap: var(--space-2xs)
	}

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
		display: inline-grid;
		place-items: center;
		padding: var(--space-xs);
		border: 2px solid var(--palette-grey-20);
		background-color: var(--palette-secondary);
		border-radius: 1rem;
		outline: none;
		filter: drop-shadow(3px 3px 0px var(--palette-grey-20));
		cursor: pointer;

		transition: 0.1s;
	}

	button:focus {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

	button:hover {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

	button:active {
		filter: drop-shadow(1px 1px 0px var(--palette-grey-20));

	}
</style>
