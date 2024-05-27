<script lang="ts">
	import { ProviderConnectionForm } from '$lib/components/index.js'
	import { providerNames } from '$lib/utils/connections.js'

	export let data
</script>

<div class="wrapper">
	<h1 class="header">Manage your connections</h1>
	{#if data.connections.length > 0}
		{#each data.connections as connection}
			<div>
				<p>{connection.providerName}</p>
			</div>
		{/each}
	{:else}
		<p>No connections yet</p>
		<div>
			{#each providerNames as providerName (providerName)}
				<ProviderConnectionForm
					type="Connect"
					providerName={providerName}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
	}
</style>
