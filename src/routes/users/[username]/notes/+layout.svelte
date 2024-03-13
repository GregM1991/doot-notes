<script lang="ts">
	import { page } from '$app/stores'
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
					<LinkButton fluid href={`/users/${$page.params.username}/notes/${note.id}`}>
						{note.title}
					</LinkButton>
				</li>
			{/each}
		</ul>
	</div>
	<slot />
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
		grid-template-areas:
			'sidebar main';
		height: 100%;
	}

	.sidebar {
		grid-area: sidebar;
		overflow-y: scroll;
		background: var(--palette-pop-extra-light);
		padding: var(--space-xs);
		padding-top: var(--space-m);
		border-radius: var(--border-radius) 0 0 var(--border-radius);
		border: 4px solid var(--palette-pop-light);
		border-right: none;
		overflow-y: hidden;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
</style>
