<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="wrapper">
	<h1>{data.user.name}'s notes</h1>
	<ul>
		{#each data.notes as note (note.id)}
			<li>{note.title}</li>
		{/each}
	</ul>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 4fr;
		grid-template-areas: 
			'sidebar main'
			'sidebar main';
		height: 100%;
	}

	h1 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		grid-area: 'sidebar';
	}

	ul {
		grid-area: 'sidebar';
	}
</style>
