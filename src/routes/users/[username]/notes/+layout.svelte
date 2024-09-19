<script lang="ts">
	import { page } from '$app/stores'
	import { Button, Pencil1 } from '$lib/components'
	import MobileSidebar from './MobileSidebar.svelte'

	let { data, children } = $props()
	const hrefBase = `/users/${$page.params.username}/notes`
	let isOwner = $state($page.data?.user?.id === data.owner.id)
</script>

<MobileSidebar name={data.owner.name} {isOwner} {hrefBase} notes={data.notes} />
<div class="wrapper">
	<div class="sidebar">
		<h1>{data.owner.name}'s notes</h1>
		{#if isOwner}
			<Button
				href="{hrefBase}/new-note"
				variant="secondary"
				style="margin-bottom: var(--space-xs)"
			>
				<Pencil1 /> Doot new note
			</Button>
		{/if}
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
		{@render children()}
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
		isolation: isolate;

		@media (--below-med) {
			grid-template-columns: 1fr;
			grid-template-areas: 'main';
		}
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

		@media (--below-med) {
			display: none;
		}
	}

	.main {
		grid-area: main;
		display: grid;
		grid-template-columns: var(--space-m) 1fr var(--space-m);
		grid-template-rows: 1fr auto;
		padding: var(--space-m);
		background: var(--palette-base-light);
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		border: 4px solid var(--palette-base-medium);
		border-left: none;
		overflow: auto;

		@media (--below-med) {
			border: none;
			border-radius: 0;
			padding-left: var(--space-l);
		}
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
</style>
