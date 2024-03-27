<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/Button/Button.svelte'
	import Timer from 'virtual:icons/radix-icons/timer'
	import Eraser from 'virtual:icons/radix-icons/eraser'
	import Pencil2 from 'virtual:icons/radix-icons/pencil2'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'

	export let data: LayoutData
	let paragraphs = data.note.content
		.split('\n')
		.filter(para => para.trim().length > 0)
</script>

<article>
	<h2>{data.note.title}</h2>
	<!-- TODO: Add note images here -->

	{#each paragraphs as paragraph}
		<p>{paragraph}</p>
	{/each}
</article>

<!-- TODO: only allow for owner of note -->
{#if $page.data.user}
	<div class="info-bar">
		<span class="time-since-update"><Timer />{data.timeSinceUpdate}</span>
		<div class="buttons">
			<Button small secondary href="{$page.params.noteid}/edit"
				><Pencil2 />Edit</Button
			>
			<form method="POST" use:enhance>
				<Button small danger type="submit"><Eraser /> Delete</Button>
			</form>
		</div>
	</div>
	<div class="blur" />
{/if}

<style>
	article {
		grid-column: 2 / 3;
		grid-row: 1 / span 2;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		overflow: auto;
	}

	h2 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
		margin-bottom: var(--space-xs);
	}

	.info-bar {
		grid-column: 1 / 4;
		grid-row: 2 / span 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		bottom: var(--space-m);
		left: var(--space-xl);
		right: var(--space-xl);
		padding: var(--space-s);
		border-radius: var(--border-radius);
		z-index: 1;
	}

	.time-since-update {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
	}

	.buttons {
		display: flex;
		gap: var(--space-s);
	}

	.blur {
		grid-column: 1 / 4;
		grid-row: 2 / span 1;
		backdrop-filter: blur(4px);
		border-radius: var(--border-radius);
		background: hsla(0, 0%, 100%, 0.7);
		z-index: 0;
	}
</style>
