<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<h1>User's</h1>
<div>
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
