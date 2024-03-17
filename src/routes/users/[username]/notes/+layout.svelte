<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '$lib/components'
	import type { LayoutServerData } from './$types'
	import Pencil1 from 'virtual:icons/radix-icons/pencil1'

	export let data: LayoutServerData
	const hrefBase = `/users/${$page.params.username}/notes`
</script>

<div class="wrapper" data-layout="grid">
	<div class="sidebar">
		<h1>{data.user.name}'s notes</h1>
		<Button href="{hrefBase}/new-note" secondary style="margin-bottom: var(--space-xs)">
			<Pencil1 /> Doot new note
		</Button>
		<ul role="list">
			{#each data.notes as note (note.id)}
				<li>
					<Button fluid href={`${hrefBase}/${note.id}`}>
						{note.title}
					</Button>
				</li>
			{/each}
		</ul>
	</div>
	<main class="main">
		<slot />
	</main>
</div>

<style>
	h1 {
		color: var(--palette-primary);
		font-size: var(--type-step-2);
		margin-bottom: var(--space-s);
		line-height: 2.2rem;
	}

	.wrapper {
		display: grid;
		grid-template-columns: 2fr 5fr;
		grid-template-areas: 'sidebar main';
		height: 100%;
	}

	.sidebar {
		grid-area: sidebar;
		background: var(--palette-pop-extra-light);
		padding: var(--space-xs);
		padding-top: var(--space-m);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		border: 4px solid var(--palette-pop-light);
		border-right: none;
		overflow-y: auto;
	}

	/* TODO: fix the scrollbar-gutter: stable both-edges; thing */
	.main {
		display: grid;
		grid-template-columns: var(--space-m) 1fr var(--space-m);
		grid-template-rows: 1fr auto;
		padding: var(--space-m);
		background: var(--palette-base-light);
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		border: 4px solid var(--palette-base-medium);
		border-left: none;
		overflow: auto;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
</style>
