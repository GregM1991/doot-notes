<script lang="ts">
	import { Input, Button } from "$lib/components"
	import Plus from 'virtual:icons/radix-icons/plus'
	import Check from 'virtual:icons/radix-icons/check'
	import type { FlattenedNoteFormErrors } from "./types"
	import { enhance } from "$app/forms"
	import { page } from "$app/stores"

	export let errors: FlattenedNoteFormErrors | null = null
	export let title = ''
	export let content = ''
	export let newNote = false
	export let action: string;
	let header =  newNote ? "Doot a new note 📯" : `Edit ${title}`
	let buttonText = newNote ? "Create note" : "Save changes"
	let Icon = newNote ? Plus : Check

	const [titleId, contentId] = [crypto.randomUUID(), crypto.randomUUID()]
</script>

<form method="POST" {action} use:enhance>
	<h3>{header}</h3>
	{#if (!newNote)}
		<input type="hidden" name="id" value={$page.params.noteid} /> 
	{/if}
	<div class="form-group">
		<Input
			errors={errors?.title}
			label="Title"
			id={titleId}
			secondary
			name="title"
			type="text"
			bind:value={title}
		/>
	</div>
	<div class="form-group">
		<Input
			textArea
			errors={errors?.content}
			label="Content"
			id={contentId}
			secondary
			name="content"
			type="content"
			bind:value={content}
		/>
	</div>
	<Button secondary type="submit">
		<Icon /> {buttonText}
	</Button>
</form>

<style>
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
</style>
