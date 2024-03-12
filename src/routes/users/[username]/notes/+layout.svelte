<script lang="ts">
	import { LinkButton } from '$lib/components'
	import type { LayoutServerData } from './$types'

	export let data: LayoutServerData
</script>

<div class="wrapper" data-layout="grid">
	<div class="sidebar">
		<h1>{data.user.name}'s notes</h1>
		<ul role="list">
			{#each data.notes as note (note.id)}
				<li>
					<LinkButton width="100%" href={note.id}>
						{note.title}
					</LinkButton>
				</li>
			{/each}
		</ul>
	</div>
	<slot>
		<span>Please select a note</span>
	</slot>
</div>

<style>
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 4fr;
		grid-template-areas:
			'sidebar main'
			'sidebar main';
		gap: var(--space-s);
		height: 100%;
	}

	.sidebar {
		grid-area: sidebar;
	}
</style>
