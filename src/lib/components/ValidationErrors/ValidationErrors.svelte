<script lang="ts">
	export let errorId: string
	export let errors: string[] | string | null | undefined
</script>

<div id="{errorId}-error" class="error">
	{#if errors}
		<ul role="list">
			{#if Array.isArray(errors)}
				{#each errors as error}
					<li>{error}</li>
				{/each}
			{:else}
				<li>{errors}</li>
			{/if}
		</ul>
	{/if}
</div>

<style>
	.error {
		min-height: var(--space-s);
		color: var(--palette-primary);
		font-size: var(--type-step--1);
		margin-top: var(--space-3xs);
	}
</style>
