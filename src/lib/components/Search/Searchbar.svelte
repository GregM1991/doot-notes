<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { Input, MagnifyingGlass, Spinner } from '$lib/components'
	import { debounce } from '$lib/utils/misc'
	import type { SearchProps } from './types.search'

	let { fetching }: SearchProps = $props()

	const handleFormChange = debounce(
		async (
			event: Event & {
				currentTarget: EventTarget & HTMLFormElement
			},
		) => {
			console.log(event)
			event.preventDefault()
			// event.currentTarget.submit()
			// const data = event.formData()
			// const search = data.get('search')
			// goto(`?search=${search}`, { replaceState: true, keepFocus: true })
			// fetching = true
		},
		400,
	)
	let search = $state($page.url.searchParams.get('search') ?? '')
	let form: HTMLFormElement
</script>

<form class="form" bind:this={form} onchange={e => handleFormChange(e)}>
	<label class="sr-only" for="search">Search</label>
	<Input
		placeholder="Search"
		name="search"
		type="search"
		bind:value={search}
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
