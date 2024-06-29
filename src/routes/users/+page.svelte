<script lang="ts">
	import { Searchbar } from '$lib/components/index'
	import { getUserImgSrc } from '$lib/utils/misc'
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

<h1>Doot Notes User's</h1>
<main>
	<Searchbar oninput={handleFormChange} fetching={Boolean($navigating) || fetching} />
	{#if data.status === 'error'}
		<span>{data.error}</span>
	{:else if Boolean(data.users.length)}
		<ul role="list">
			{#each data.users as user}
				<!-- TODO: Extract this to component -->
				<li>
					<a
						data-sveltekit-preload-data="hover"
						href={`/users/${user.username}`}
					>
						<span class="gravatar">
							<img
								src={getUserImgSrc(user.imageId)}
								alt={user.name ?? user.username}
								class="avatar-image"
							/>
						</span>
						<span>{user.name}</span>
						<span class="username">{user.username}</span>
					</a>
				</li>
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
		padding: var(--space-m);
		text-align: center;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-m);
		text-align: center;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		place-items: center;
		gap: var(--space-s);
	}

	a {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-s);
		background: var(--palette-primary-ultra-light);
		border-radius: 1rem;
		border: var(--border-primary);
		text-align: center;
		font-weight: var(--type-weight-bold);
		height: 10rem;
		width: 12rem;
	}

	.gravatar {
		display: inline-block;
		margin-bottom: var(--space-2xs);
		font-size: 2rem;
		background: var(--palette-base);
		border-radius: var(--border-radius-circle);
		width: 4rem;
		height: 4rem;
	}

	span {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
	}

	span.username {
		font-size: var(--type-step--1);
		font-weight: 400;
	}
</style>
