<script lang="ts">
	// import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { debounce } from '$utils/misc'

	export let data: PageData
	let search = data.searchQuery || ''
	console.log(data.searchQuery)
	$: console.log(search)
</script>

<h1>User's</h1>
<div>
	<form method="GET" action="/users">
		<label class="sr-only" for="search">Search</label>
		<input
			placeholder="Search"
			name="search"
			type="search"
			bind:value={search}
		/>
		<button>Search</button>
	</form>
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
