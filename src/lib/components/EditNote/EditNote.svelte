<script lang="ts">
	import {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import {
		Input,
		TextArea,
		Button,
		ImageEditor,
		NoteInfoBar,
		FormGroup,
		ValidationErrors,
		Check,
		Cross,
		Plus,
	} from '$lib/components'
	import type { ImageFieldset } from './types'
	import { NoteEditorSchema } from '$lib/schemas'
	import { generateCopy } from './editNote.helpers'
	import { idTestId, imageListTestId } from './consts.editNote'

	export let data: SuperValidated<Infer<typeof NoteEditorSchema>>
	export let images: Array<ImageFieldset> = []
	export let action: string

	const { form, errors, enhance, formId, constraints, delayed, timeout } =
		superForm(data, {
			validators: zodClient(NoteEditorSchema),
		})
	const { header, buttonText, submitDelayedReason } = generateCopy(
		$form.id,
		$form.title,
	)
	const Icon = $form.id ? Check : Plus

	$: imageList = images.length
		? images
		: [{ id: undefined, file: undefined, altText: undefined }]

	function addEmptyImage() {
		imageList = [
			...imageList,
			{ id: undefined, file: undefined, altText: undefined },
		]
	}
</script>

<form
	class="edit-form"
	method="POST"
	{action}
	use:enhance
	enctype="multipart/form-data"
>
	<button type="submit" class="hidden"></button>
	<h3>{header}</h3>
	{#if $form.id}
		<input hidden value={$form.id} name="id" data-testid={idTestId} />
	{/if}
	<!-- TODO: Focus first input -->
	<FormGroup flex="0">
		<Input
			errors={$errors.title}
			label="Title"
			secondary
			name="title"
			type="text"
			bind:value={$form.title}
			constraints={$constraints.title}
		/>
	</FormGroup>
	<FormGroup flex="1 0 0">
		<TextArea
			name="content"
			label="Content"
			secondary
			required
			bind:value={$form.content}
			errors={$errors.content}
			fluid
			constraints={$constraints.content}
		/>
	</FormGroup>
	<span>Images</span>
	<ul class="image-list" data-testid={imageListTestId}>
		{#each imageList as image, index (index)}
			<li class="image-list-item">
				<!-- TODO: //create form action for delete later -->
				<button
					formaction="?/delete"
					class="remove-image-button"
					name="id"
					value={image.id ?? index}
					on:click|preventDefault={() =>
						(imageList = imageList.filter((_, i) => i !== index))}
				>
					<span aria-hidden="true">
						<Cross />
					</span>
					<span class="sr-only">Remove image {index}</span>
				</button>
				<ImageEditor {image} {index} />
			</li>
		{/each}
	</ul>
	<Button variant="secondary" type="button" on:click={addEmptyImage}>
		<Plus />
		Add another image
	</Button>
	<NoteInfoBar>
		<div class="info-bar-buttons">
			<Button danger type="reset">Reset</Button>
			<!-- TODO: confirmation on note deletion -->
			<Button
				variant="secondary"
				type="submit"
				delayed={$delayed || $timeout}
				delayedReason={submitDelayedReason}
			>
				<Icon />
				{buttonText}
			</Button>
		</div>
	</NoteInfoBar>
	<ValidationErrors errorId={$formId} errors={$errors._errors} />
</form>

<style>
	.hidden {
		display: none;
	}

	.edit-form {
		grid-row: 1 / span 2;
		grid-column: 2 / 3;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		align-items: stretch;
	}

	h3 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
	}

	.image-list-item {
		list-style: none;
		position: relative;
		padding-bottom: var(--space-xs);
	}

	.remove-image-button {
		display: grid;
		place-items: center;
		position: absolute;
		right: 0;
		top: 0;
		border: none;
		background: none;
		color: tomato;
		cursor: pointer;
	}

	.remove-image-button span {
		display: flex;
	}

	.info-bar-buttons {
		display: flex;
		gap: var(--space-2xs);
		align-items: center;
		justify-content: flex-end;
		width: 100%;
	}
</style>
