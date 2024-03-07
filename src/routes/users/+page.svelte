<script lang="ts">
	// import { page } from '$app/stores'
	import type { PageData } from './$types'

  // TODO: Figure out how to pull the page params
	export let data: PageData
  const id = crypto.randomUUID()
	console.log(data.searchQuery)
</script>

<h1>User's</h1>
<div>
	<form method="GET">
		<label class="sr-only" for={id}> Search </label>
		<input placeholder="Search" name="search" type="search" id={id} />
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
