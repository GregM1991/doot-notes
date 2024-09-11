<script lang="ts">
	import { Input, Plus } from '$lib/components'
	import { getNoteImgSrc } from '$lib/utils/misc'
	import type { ImageFieldset } from '$lib/components/EditNote/types.editNote'

	export let image: ImageFieldset | undefined
	export let index: number

	let previewImage: string | null = image?.id ? getNoteImgSrc(image?.id) : null
	const existingImage = Boolean(image?.id)

	const fileGroupPrefix = `note-editor-images[${index}]`
	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				previewImage = reader.result as string
			}
			reader.readAsDataURL(file)
		} else {
			previewImage = null
		}
	}
</script>

<fieldset id={fileGroupPrefix} class="container">
	<legend class="sr-only">Select an image to upload</legend>

	<!-- TODO: fix focus for file input -->
	<div class="file-input-container">
		<label class="file-label">
			{#if previewImage}
				<img
					class="preview-image absolute"
					src={previewImage}
					alt={image?.altText ?? ''}
				/>
			{:else}
				<button class="plus">
					<Plus />
				</button>
			{/if}
			<input
				on:change={handleFileChange}
				id="{fileGroupPrefix}.file"
				name="images[{index}].file"
				value={image?.file}
				class="file absolute"
				type="file"
				accept="image/*"
				aria-label="Image"
			/>
		</label>
		<!-- <ValidationErrors {errors} errorId={fileId} /> -->
		{#if existingImage && image?.id}
			<input
				type="hidden"
				id="{fileGroupPrefix}.id"
				name="images[{index}].id"
				value={image?.id}
			/>
		{/if}
	</div>
	<div class="alt-input">
		<Input
			label="Alt text"
			id="{fileGroupPrefix}.altText"
			name="images[{index}].altText"
			value={image?.altText ?? ''}
			type="text"
			fluid
		/>
	</div>
</fieldset>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		border: none;
	}

	.file-input-container {
		height: var(--space-3xl);
		width: var(--space-3xl);
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
		height: calc(var(--space-3xl) - 2px);
		width: calc(var(--space-3xl) - 2px);
		cursor: pointer;
	}

	.preview-image {
		border-radius: var(--border-radius);
		height: calc(var(--space-3xl) - 2px);
		width: calc(var(--space-3xl) - 2px);
	}

	.file {
		opacity: 0;
		cursor: pointer;
		height: var(--space-3xl);
		width: var(--space-3xl);
	}

	.absolute {
		position: absolute;
		top: 0;
		left: 0;
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

	.alt-input {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
