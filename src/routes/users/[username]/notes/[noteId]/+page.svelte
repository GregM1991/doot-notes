<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/Button/Button.svelte'
	import Timer from 'virtual:icons/radix-icons/timer'
	import Eraser from 'virtual:icons/radix-icons/eraser'
	import Pencil2 from 'virtual:icons/radix-icons/pencil2'
	import { page } from '$app/stores'
	import { NoteInfoBar } from '$lib/components'
	import { getNoteImgSrc } from '$lib/utils/misc.js'

	export let data
</script>

<article class="article">
	<h2 class="heading">{data.note.title}</h2>
	<ul class="image-list">
		{#each data.note.images as image}
			<li>
				<a href={getNoteImgSrc(image.id)}>
					<img src={getNoteImgSrc(image.id)} alt={image.altText ?? ''} />
				</a>
			</li>
		{/each}
	</ul>

	{#each data.note.content as paragraph}
		<p>{paragraph}</p>
	{/each}
</article>

{#if data.isOwner}
	<NoteInfoBar>
		<span class="time-since-update"><Timer />{data.timeSinceUpdate}</span>
		<div class="buttons">
			<Button small secondary href="{$page.params.noteId}/edit">
				<Pencil2 /> Edit
			</Button>
			<form method="POST" use:enhance>
				<Button small danger type="submit"><Eraser /> Delete</Button>
			</form>
		</div>
	</NoteInfoBar>
{/if}

<style>
	.article {
		grid-column: 2 / 3;
		grid-row: 1 / span 2;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		overflow: auto;
	}

	.heading {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		line-height: 2.8rem;
	}

	.image-list {
		display: flex;
		gap: var(--space-2xs);
		flex-wrap: wrap;
		padding: var(--space-xs) 0;
		list-style: none;
	}

	.image-list img {
		width: 9rem;
		height: 9rem;
		border-radius: var(--border-radius);
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
</style>
