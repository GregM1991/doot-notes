<script lang="ts">
	// TODO: If I feel like it, I can revisit this to cater to non-js users
	// https://www.npmjs.com/package/parse-nested-form-data
	// https://svelte.dev/repl/d8916d45012241dab5962c1323604fe9?version=4.2.0
	// https://github.com/ciscoheat/sveltekit-superforms/issues/186
	import SuperDebug, {
		type SuperValidated,
		type Infer,
		superForm,
	} from 'sveltekit-superforms'
	import Check from 'virtual:icons/radix-icons/check'
	import Cross from 'virtual:icons/radix-icons/cross2'
	import Plus from 'virtual:icons/radix-icons/plus'
	import {
		Input,
		TextArea,
		Button,
		ImageEditor,
		NoteInfoBar,
		FormGroup,
		ValidationErrors,
	} from '$lib/components'
	import { NoteEditorSchema, type ImageFieldset } from './types'

	export let data: SuperValidated<Infer<typeof NoteEditorSchema>>
	export let images: Array<ImageFieldset> = []
	export let action: string

	const { form, errors, enhance, formId } = superForm(data)
	const header = $form.id ? `Edit ${$form.title}` : 'Doot a new note 📯'
	const buttonText = $form.id ? 'Save changes' : 'Create note'
	const Icon = $form.id ? Check : Plus

	$: imageList = images

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
	<button type="submit" class="hidden" />
	<h3>{header}</h3>
	{#if $form.id}
		<input type="hidden" value={$form.id} name="id" />
	{/if}
	<!-- TODO: Focus first input -->
	<FormGroup flex="0">
		<Input
			errors={$errors.title}
			label="Title"
			secondary
			name="title"
			type="text"
			value={$form.title}
			required
		/>
	</FormGroup>
	<FormGroup flex="1 0 0">
		<TextArea
			name="content"
			label="Content"
			secondary
			required
			value={$form.content}
			errors={$errors.content}
			fluid
		/>
	</FormGroup>
	<span>Images</span>
	<ul class="image-list">
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
					<span aria-hidden>
						<Cross />
					</span>
					<span class="sr-only">Remove image {index}</span>
				</button>
				<ImageEditor {image} {index} />
			</li>
		{/each}
	</ul>
	<Button secondary type="button" on:click={addEmptyImage}>
		<Plus />
		Add another image
	</Button>
	<NoteInfoBar>
		<div class="info-bar-buttons">
			<Button danger type="reset">Reset</Button>
			<!-- TODO: confirmation on note deletion -->
			<Button secondary type="submit">
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
