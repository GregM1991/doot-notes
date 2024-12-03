<!-- <script lang="ts">
	// import { Plus } from '$lib/components'
	// const maxSizeMB = 50

	// let error: string | null = $state(null)
	// let video: File | null = $state(null)

	let { id }: { id: string | undefined } = $props()
</script>

{#if id}
	<input type="hidden" {id} name="video.id" value={id} />
{/if}
<label class="video-label">
	Upload Video
	<input
		id="video-upload"
		name="video.file"
		type="file"
		accept="video/*"
		aria-label="Image"
	/>
</label> -->

<script lang="ts">
	import { Cross, Input, Plus } from '$lib/components'
	import { createVideoState } from './helpers.videoEditor.svelte'
	import type { VideoEditorProps } from './types.videoEditor'

	let { video }: { video: VideoEditorProps } = $props()

	const helperState = createVideoState(video)
</script>

<div class="video-container">
	<fieldset class="container">
		<legend class="sr-only">Select a video to upload</legend>

		<div class="file-input-container">
			<label class="file-label">
				{#if helperState.state.videoThumb}
					<img
						class="preview-video absolute"
						src={helperState.state.videoThumb}
						alt="A preview thumbnail of your video note"
					/>
				{:else}
					<button class="plus">
						<Plus />
					</button>
				{/if}
				<input
					onchange={helperState.handleFileChange}
					id="video-upload"
					name="video.file"
					class="file absolute"
					type="file"
					accept="video/*"
					aria-label="Video"
				/>
			</label>

			{#if video}
				<input type="hidden" id="video-id" name="video.id" value={video.id} />
			{/if}
		</div>
		<div class="alt-input">
			<Input
				label="Alt text"
				id="video.alt-text"
				name="video.alt-text"
				value={helperState.state.altText}
				type="text"
				fluid
			/>
		</div>

		{#if video}
			<button
				formaction="?/deleteVideo"
				class="remove-video-button"
				name="videoId"
				value={video.id}
				onclick={() => helperState.clearVideo()}
			>
				<span aria-hidden="true">
					<Cross />
				</span>
				<span class="sr-only">Remove video</span>
			</button>
		{/if}
	</fieldset>
</div>

<style>
	.video-container {
		--thumb-height: 150px;
		--thumb-width: 280px;
		position: relative;
	}

	.container {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		border: none;
	}

	.file-input-container {
		height: var(--thumb-height);
		width: var(--thumb-width);
		background: var(--palette-base);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
	}

	.file-input-container:focus-visible {
		filter: var(--border-drop-shadow-black-focus);
	}

	.file-label {
		display: inline-block;
		position: relative;
		height: calc(var(--thumb-height) - 2px);
		width: calc(var(--thumb-width) - 2px);
		cursor: pointer;
	}

	.preview-video {
		border-radius: var(--border-radius);
		height: calc(var(--thumb-height) - 2px);
		width: calc(var(--thumb-width) - 2px);
		object-fit: cover;
	}

	.file {
		opacity: 0;
		cursor: pointer;
		height: var(--thumb-height);
		width: var(--thumb-width);
	}

	.absolute {
		position: absolute;
		top: 0;
		left: 0;
	}

	.alt-input {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.plus {
		display: grid;
		place-items: center;
		height: 100%;
		width: 100%;
		font-size: var(--type-step-1);
		border: none;
		background: none;
	}

	.remove-video-button {
		display: grid;
		place-items: center;
		border: none;
		background: none;
		color: tomato;
		cursor: pointer;
		position: absolute;
		top: 0;
		right: 0;
	}

	.remove-video-button span {
		display: flex;
	}
</style>
