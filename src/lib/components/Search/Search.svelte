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
	<button>Search</button>
</form>
