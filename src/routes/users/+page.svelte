<script lang="ts">
	import { Search } from '$lib/components'
	import type { PageData } from './$types'
	import { debounce } from '$lib/utils/misc'
	import { goto } from '$app/navigation'

	export let data: PageData

	const searchUsers = debounce(async () => {
		const data = new FormData(form)
		const search = data.get('search')
		goto(`?search=${search}`, { replaceState: true, keepFocus: true })
	}, 400)

</script>

<h1>User's</h1>
<div>
	<Search />
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
