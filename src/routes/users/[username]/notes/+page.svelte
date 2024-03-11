<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<main>
	<h1>{data.user.name}'s notes</h1>
</main>

<style>
	h1 { 
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
	}
</style>