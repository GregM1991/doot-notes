<script lang="ts">
	import { Search, type OnSearch } from '$lib/components/index'
	import { debounce } from '$lib/utils/misc'
	import { goto } from '$app/navigation'

	export let data

	const searchUsers = debounce(async (event: CustomEvent<OnSearch>) => {
		console.log('hello')
		const data = new FormData(event.detail.form)
		const search = data.get('search')
		goto(`?search=${search}`, { replaceState: true, keepFocus: true })
	}, 400)
</script>

<h1>Doot Notes User's</h1>
<div>
	<Search on:search={searchUsers} on:submit={searchUsers} />
	{#if data.status === 'error'}
		<span>{data.error}</span>
	{:else if data.users.length}
		<ul>
			{#each data.users as user}
				<li>{user.username}</li>
			{/each}
		</ul>
	{:else}
		<span>No users were found.</span>
	{/if}
</div>

<style>
	h1 {
		font-size: var(--type-step-4);
	}
</style>