<script lang="ts">
	import { Searchbar, type OnSearch } from '$lib/components/index'
	import { debounce } from '$lib/utils/misc'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	export let data

	const searchUsers = debounce(async (event: CustomEvent<OnSearch>) => {
		const data = new FormData(event.detail.form)
		const search = data.get('search')
		goto(`?search=${search}`, { replaceState: true, keepFocus: true })
	}, 400)
	const search = $page.url.searchParams.get('search') ?? ''
</script>

	<h1>Doot Notes User's</h1>
	<main>
		<Searchbar
			on:search={searchUsers}
			on:submit={searchUsers}
			searchQuery={search}
		/>
		{#if data.status === 'error'}
			<span>{data.error}</span>
		{:else if data.users.length}
			<ul role="list">
				{#each data.users as user}
					<a data-sveltekit-preload-data="hover" href={`/users/${user.username}`}>
						<li>
							<!-- TODO: put gravatar in -->
							<span>{user.name}</span>
							<span class="username">{user.username}</span>
						</li>
					</a>
				{/each}
			</ul>
		{:else}
			<span>No users were found.</span>
		{/if}
	</main>

<style>
	/* TODO: Create Typography component */
	h1 {
		color: var(--palette-pop);
		font-size: var(--type-step-4);
		margin: var(--space-m);
		text-align: center;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-m);
	}

	ul {
		display: flex;
		gap: var(--space-s);
	}

	li {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		padding: var(--space-s);
		background: var(--palette-primary-ultra-light);
		border-radius: 1rem;
		border: var(--border-primary);
		text-align: center;
		font-weight: var(--type-weight-bold);
	}

	span.username {
		font-size: var(--type-step--1);
		font-weight: 400;
	}
</style>
