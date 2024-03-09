<script lang="ts">
	// import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { debounce } from '$utils/misc'
	import { goto } from '$app/navigation'

	export let data: PageData
	console.log(data)
	let form: HTMLFormElement

	const searchUsers = debounce(async () => {
		const data = new FormData(form)
		const search = data.get('search')
		goto(`?search=${search}`, { replaceState: true, keepFocus: true })
	}, 400)

</script>

<h1>User's</h1>
<div>
	<form bind:this={form} on:submit|preventDefault={searchUsers}>
		<label class="sr-only" for="search">Search</label>
		<!-- svelte-ignore a11y-autofocus -->
		<input
			placeholder="Search"
			name="search"
			type="search"
			on:input={searchUsers}
			autofocus
			value={data.searchQuery ?? ''}
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
