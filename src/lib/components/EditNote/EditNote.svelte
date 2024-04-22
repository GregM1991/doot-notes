<script lang="ts">
	import {} from 'sveltekit-superforms'
	import {
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
	} from '$lib/components'
	import { NoteEditorSchema } from './types'
	import { removeButtonValue } from './editNote.helpers'

	export let data: SuperValidated<Infer<typeof NoteEditorSchema>>
	const { form, errors, enhance } = superForm(data)
	export let action: string

	// consts
	let imageList = $form?.images?.length ? $form.images : [{}]
	const header = $form ? `Edit ${$form.title}` : 'Doot a new form 📯'
	const buttonText = $form ? 'Save changes' : 'Create $form'
	const Icon = $form ? Check : Plus
</script>

<!-- TODO: Have the validation for this form be executed via JS (progressively enhanced) -->

<form method="POST" {action} use:enhance enctype="multipart/form-data">
	<button type="submit" class="hidden" />
	<h3>{header}</h3>
	{#if $form.id}
		<input type="hidden" name="id" value={$form.id} />
	{/if}
	<div class="form-group">
		<Input
			errors={$errors?.title}
			label="Title"
			secondary
			name="title"
			type="text"
			value={$form?.title ?? ''}
			required
		/>
	</div>
	<div class="form-group full-height">
		<TextArea
			name="content"
			label="Content"
			secondary
			required
			value={$form?.content ?? ''}
			errors={$errors?.content}
		/>
	</div>
	<span>Images</span>
	<ul>
		{#each imageList as image, index}
			<li>
				<button
					class="remove-image-button"
					name="__intent__"
					value={removeButtonValue(index)}
					formnovalidate={true}
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
	<Button type="button" on:click={() => (imageList = [...imageList, {}])}>
		<Plus />
		Add another image
	</Button>
	<NoteInfoBar>
		<div class="info-bar-buttons">
			<Button danger type="reset">Reset</Button>
			<Button secondary type="submit">
				<Icon />
				{buttonText}
			</Button>
		</div>
	</NoteInfoBar>
</form>

<style>
	.hidden {
		display: none;
	}

	form {
		grid-row: 1 / span 2;
		grid-column: 2 / 3;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	h3 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.full-height {
		flex: 1;
	}

	li {
		list-style: none;
		position: relative;
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
