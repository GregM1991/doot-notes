<script lang="ts">
	import { Input, ValidationErrors } from '$lib/components'
	import { getNoteImgSrc } from '$lib/utils/misc'
	import Plus from 'virtual:icons/radix-icons/plus'
	import type { ImageFieldset } from '$lib/components/EditNote/types'

	export let index: number
	export let image: ImageFieldset | null = null
	export let errors: Array<string> | null = null
	// TODO: Move this to +page.server? 
	let previewImage: string | null = image?.id ? getNoteImgSrc(image.id) : null

	const fileId = `note-editor-images[${index}].file`
	const altId = `note-editor-images[${index}].altText`

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

<fieldset class="container">
	<legend class="sr-only">Select an image to upload</legend>

	<!-- TODO: fix focus for file input -->
	<div class="file-input-container">
		<label for={fileId} class="file-label">
			{#if previewImage}
				<img
					class="preview-image"
					src={previewImage}
					alt={image?.altText ?? ''}
				/>
			{:else}
				<div class="plus">
					<Plus />
				</div>
			{/if}
			<input
				id={fileId}
				on:change={handleFileChange}
				class="file"
				name="images[{index}].file"
				type="file"
				accept="image/*"
				aria-label="Image"
			/>
		</label>
		<ValidationErrors {errors} errorId={fileId} />
		{#if image}
			<input type="hidden" name="id" value={image.id} />
		{/if}
	</div>
	<div class="alt-input">
		<Input label="Alt text" textArea name={altId} />
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
		cursor: pointer;
	}

	.preview-image {
		border-radius: var(--border-radius);
		object-fit: cover;
	}

	.plus {
		display: grid;
		place-items: center;
		height: 100%;
		font-size: var(--type-step-1);
	}

	.file {
		opacity: 0;
		cursor: pointer;
		height: var(--space-3xl);
		width: var(--space-3xl);
	}

	.alt-input {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
