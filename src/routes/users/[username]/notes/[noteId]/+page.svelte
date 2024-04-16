<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/Button/Button.svelte'
	import Timer from 'virtual:icons/radix-icons/timer'
	import Eraser from 'virtual:icons/radix-icons/eraser'
	import Pencil2 from 'virtual:icons/radix-icons/pencil2'
	import { page } from '$app/stores'
	import { NoteInfoBar } from '$lib/components'

	export let data
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
