<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, Button } from '$lib/components'
	import Plus from 'virtual:icons/radix-icons/plus'
	import Check from 'virtual:icons/radix-icons/check'

	export let errors: { title: string[]; content: string[] } | null = null
	export let title = ''
	export let content = ''
	export let newNote = false
	export let action: string
	let header = newNote ? 'Doot a new note 📯' : `Edit ${title}`
	let buttonText = newNote ? 'Create note' : 'Save changes'
	let Icon = newNote ? Plus : Check

	const [titleId, contentId] = [crypto.randomUUID(), crypto.randomUUID()]
</script>

<form method="POST" {action} use:enhance>
	<h3>{header}</h3>
	{#if !newNote}
		<input type="hidden" name="id" value={note.id} />
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
			required
		/>
	</div>
	<div class="form-group full-height">
		<Input
			textArea
			errors={errors?.content}
			label="Content"
			id={contentId}
			secondary
			name="content"
			bind:value={content}
			style="height: 100%"
			required
		/>
	</div>
	<Button secondary type="submit">
		<Icon />
		{buttonText}
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

	.full-height {
		flex: 1;
	}
</style>
