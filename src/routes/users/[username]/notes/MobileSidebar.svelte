<script lang="ts">
	import { Button, Corner, Pencil1 } from '$lib/components'

	type MobileSidebarProps = {
		name: string
		isOwner: boolean
		hrefBase: string
		notes: Array<{
			id: string
			title: string
		}>
	}

	let isActive = $state(false)

	function toggle() {
		isActive = !isActive
	}

	let { name, isOwner, hrefBase, notes }: MobileSidebarProps = $props()
</script>

<div class="mobile-sidebar">
	<div class="sidebar {isActive ? 'is-active' : ''}">
		<h1>{name}'s notes</h1>
		{#if isOwner}
			<Button
				href="{hrefBase}/new-note"
				variant="secondary"
				style="margin-bottom: var(--space-xs)"
				onclick={toggle}
			>
				<Pencil1 /> Doot new note
			</Button>
		{/if}
		<ul role="list">
			{#each notes as note (note.id)}
				<li>
					<Button onclick={toggle} fluid href={`${hrefBase}/${note.id}`}>
						{note.title}
					</Button>
				</li>
			{/each}
		</ul>
		<button onclick={toggle} class="notes-trigger">
			<span class="corner top">
				<Corner />
			</span>
			<span class="corner bottom">
				<Corner />
			</span>
			Notes
		</button>
	</div>
</div>

<style>
	.mobile-sidebar {
		@media (--above-med) {
			display: none;
		}
	}

	.sidebar {
		position: fixed;
		display: flex;
		flex-direction: column;
		gap: var(--space-s);
		background: var(--palette-pop-extra-light);
		padding: var(--space-xs);
		border: 4px solid var(--palette-pop-light);
		border-left: none;
		bottom: 0;
		height: calc(100vh - var(--space-3xl));
		width: calc(100vw - 42px);
		transition: ease-out 0.2s;
		z-index: 1;
		transform: translateX(-100%);

		ul {
			display: flex;
			flex-direction: column;
			gap: var(--space-s);
		}
	}

	.is-active {
		transform: translateX(0);
		transition: ease-out 0.4s;
	}

	.notes-trigger {
		display: grid;
		place-items: center;
		position: absolute;
		right: -44px;
		top: calc(50% - 33px);
		padding: var(--space-xs) 0px;
		writing-mode: vertical-rl;
		background: var(--palette-pop-light);
		width: 40px;
		border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0;

		.corner {
			position: absolute;
			left: 1px;
			width: 17px;
			color: var(--palette-pop-light);
		}
		.top {
			top: 0;
			transform: translateY(-100%);
		}
		.bottom {
			bottom: 0;
			transform: scaleY(-1) translateY(-100%);
		}
	}
</style>
