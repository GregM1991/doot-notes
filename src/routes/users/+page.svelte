<script lang="ts">
	import { Searchbar, UserCard } from '$lib/components'
	import { goto } from '$app/navigation'
	import { debounce } from '$lib/utils/misc'
	import { navigating } from '$app/stores'

	let { data } = $props()
	let fetching = $state(Boolean(data.fetching))

	const handleFormChange = debounce(async (form: HTMLFormElement) => {
		const formData = new FormData(form)
		const search = formData.get('search')
		goto(`?search=${search}`, { replaceState: true, keepFocus: true })
	}, 400)
</script>

<main>
	<h1>Doot Notes User's</h1>
	<Searchbar
		oninput={handleFormChange}
		fetching={Boolean($navigating) || fetching}
	/>
	{#if data.status === 'error'}
		<span>{data.error}</span>
	{:else if Boolean(data.users.length)}
		<ul class="users-list" role="list">
			{#each data.users as { username, name, imageId }}
				<!-- TODO: Extract this to component -->
				<li>
					<UserCard {username} {name} {imageId} />
				</li>
			{/each}
		</ul>
	{:else}
		<span>No users were found.</span>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
		text-align: center;
		padding: var(--space-l);
	}

	/* TODO: Create Typography component */
	h1 {
		color: var(--palette-pop);
		font-size: var(--type-step-4);
		text-align: center;
	}

	.users-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		place-items: center;
		gap: var(--space-m) var(--space-s);
		margin-top: 15px; /*  How far the gravatar sticks out */
	}
</style>
