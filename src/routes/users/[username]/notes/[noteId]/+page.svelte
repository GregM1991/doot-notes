<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import {
		Button,
		NoteInfoBar,
		Eraser,
		Pencil2,
		Timer,
		Spinner,
	} from '$lib/components'
	import { getNoteImgSrc, getNoteVideoThumbSrc } from '$lib/utils/misc'

	export let data
</script>

{#await data.note}
	<Spinner />
{:then}
	<article class="article">
		<h2 class="heading">{data.note.title}</h2>
		{#if data.note.images.length > 0}
			<ul class="image-list">
				{#each data.note.images as image}
					<li>
						<a aria-label="load-image" href={getNoteImgSrc(image.id)}>
							<img src={getNoteImgSrc(image.id)} alt={image.altText ?? ''} />
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<div class="content-block">
			{#each data.note.content as paragraph}
				<p>{paragraph}</p>
			{/each}
		</div>
		{#if data.video}
			<span class="hr"></span>
			<div class="content-block">
				<h3 class="video-title">Video Note: {data.video.fileName}</h3>
				<a class="video-link" href="{data.note.id}/video-note">
					<img
						src={getNoteVideoThumbSrc(data.video.thumbnailKey)}
						alt="Thumbnail preview for video note"
						class="thumbnail"
					/>
				</a>
			</div>
		{/if}
	</article>

	{#if data.isOwner}
		<NoteInfoBar>
			<span class="time-since-update"><Timer />{data.timeSinceUpdate}</span>
			<div class="buttons">
				<Button small variant="secondary" href="{$page.params.noteId}/edit">
					<Pencil2 />Edit
				</Button>
				<form method="POST" use:enhance>
					<Button small danger type="submit"><Eraser />Delete</Button>
				</form>
			</div>
		</NoteInfoBar>
	{/if}
{:catch error}
	<p>{error.message}</p>
{/await}

<style>
	.article {
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
		padding-bottom: var(--space-xl);
		height: 100%;
		overflow-y: auto;
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

		img {
			width: 9rem;
			height: 9rem;
			border-radius: var(--border-radius);
		}
	}

	.content-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
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

	.video-link {
		width: max-content;
	}

	.thumbnail {
		width: 280px;
		height: 150px;
	}

	.hr {
		height: 1px;
		background: var(--palette-pop);
	}

	.video-title {
		font-size: var(--type-step-0);
		font-family: var(--type-body);
		letter-spacing: normal;
	}
</style>
