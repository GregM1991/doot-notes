<!-- TODO: This is quite the component, will need a clean up at some stage NOT-63 -->
<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import {
		Input,
		TextArea,
		Button,
		ImageEditor,
		FormGroup,
		ValidationErrors,
		Cross,
		Plus,
	} from '$lib/components'
	import type { EditNoteProps } from './types.editNote'
	import { NoteEditorSchema } from '$lib/schemas'
	import { generateCopy } from './editNote.helpers'
	import { idTestId, imageListTestId } from './consts.editNote'
	import InfoBar from './InfoBar.svelte'

	let { data, action, images }: EditNoteProps = $props()
	let imageList = $state(
		images?.length
			? images
			: [{ id: undefined, file: undefined, altText: undefined }],
	)

	const { form, errors, enhance, formId, constraints, delayed, timeout } =
		superForm(data, {
			validators: zodClient(NoteEditorSchema),
		})
	const { header, buttonText, submitDelayedReason } = generateCopy(
		$form.id,
		$form.title,
	)

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
				<!-- TODO: //create form action for delete later NOT-46 -->
				<button
					formaction="?/delete"
					class="remove-image-button"
					name="id"
					value={image.id ?? index}
					onclick={() => {
						imageList = imageList.filter((_, i) => i !== index)
					}}
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
	<!-- TODO: AddEmptyImage is not working 🐛 NOT-65 -->
	<Button variant="secondary" type="button" onclick={addEmptyImage}>
		<Plus />
		Add another image
	</Button>
	<InfoBar {formId} {buttonText} {submitDelayedReason} {delayed} {timeout} />
	<ValidationErrors errorId={$formId} errors={$errors._errors} />
</form>

<style>
	.hidden {
		display: none;
	}

	.edit-form {
		grid-column: 2 / 3;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		align-items: stretch;

		@media (--below-med) {
			grid-column: 1 / 3;
		}
	}

	h3 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
	}

	.image-list {
		list-style: none;
		display: flex;
		flex-direction: column;
	}

	.image-list-item {
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
</style>
