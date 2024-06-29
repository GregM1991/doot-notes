<script lang="ts">
	import { page } from '$app/stores'
	import { Input, MagnifyingGlass, Spinner } from '$lib/components'
	import type { SearchProps } from './types.search'

	let { fetching, oninput }: SearchProps = $props()

	let search = $state($page.url.searchParams.get('search') ?? '')
	let form: HTMLFormElement
</script>

<form class="form" bind:this={form}>
	<label class="sr-only" for="search">Search</label>
	<Input
		placeholder="Search"
		name="search"
		type="search"
		bind:value={search}
		oninput={() => oninput(form)}
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
