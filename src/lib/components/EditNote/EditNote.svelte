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
		Plus,
	} from '$lib/components'
	import type { EditNoteProps } from './types.editNote'
	import { NoteEditorSchema } from '$lib/schemas'
	import { createState, generateCopy } from './helpers.editNote.svelte'
	import { idTestId, imageListTestId } from './consts.editNote'
	import InfoBar from './InfoBar.svelte'

	let { data, action, images }: EditNoteProps = $props()
	const helperState = createState(images)
	const { form, errors, enhance, formId, constraints, delayed, timeout } =
		superForm(data, {
			validators: zodClient(NoteEditorSchema),
		})
	const { header, buttonText, submitDelayedReason } = generateCopy(
		$form.id,
		$form.title,
	)
</script>

<form
	class="edit-form"
	method="POST"
	{action}
	use:enhance
	enctype="multipart/form-data"
>
	<button aria-label="submit" type="submit" class="hidden"></button>
	<h3>{header}</h3>
	{#if $form.id}
		<input hidden value={$form.id} name="id" data-testid={idTestId} />
	{/if}
	<FormGroup flex="0">
		<Input
			errors={$errors.title}
			label="Title"
			secondary
			name="title"
			type="text"
			bind:value={$form.title}
			constraints={$constraints.title}
			autofocus
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
		{#each helperState.imageList as image, index (index)}
			<ImageEditor {image} {index} deleteImage={helperState.deleteImage} />
		{/each}
	</ul>
	<Button variant="secondary" type="button" onclick={helperState.addEmptyImage}>
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
</style>
