<script lang="ts">
	import { Input } from '$lib/components'
	import { getNoteImgSrc } from '$lib/utils/misc'
	import Plus from 'virtual:icons/radix-icons/plus'
	import type {
		ImageFieldset,
		NoteEditorSchema,
	} from '$lib/components/EditNote/types'
	import type { Infer, SuperValidated } from 'sveltekit-superforms'

	// export let image: ImageFieldset | undefined
	export let id: string | null = null
	export let fileValue: File | null = null
	export let altTextValue: string | null = null
	// const file = fileProxy(form.data.images[index], 'file')
	// TODO: Errors
	// export let errors: {
	// 	file: string[] | undefined
	// 	altText: string[] | undefined
	// } | null = null

	let previewImage: string | null = id ? getNoteImgSrc(id) : null

	const existingImage = Boolean(id)

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
		<label class="file-label">
			{#if previewImage}
				<img
					class="preview-image absolute"
					src={previewImage}
					alt={altTextValue ?? ''}
				/>
			{:else}
				<div class="plus">
					<Plus />
				</div>
			{/if}
			<!-- <input
				bind:files={fileValue}
				class="file absolute"
				type="file"
				accept="image/*"
				aria-label="Image"
			/> -->
		</label>
		<!-- <ValidationErrors {errors} errorId={fileId} /> -->
		{#if existingImage && id}
			<input type="hidden" value={id} />
		{/if}
	</div>
	<div class="alt-input">
		<Input label="Alt text" name="" value={altTextValue} />
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
		font-size: var(--type-step-1);
	}

	.alt-input {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
