<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input } from '$lib/components'
	import Plus from 'virtual:icons/radix-icons/plus'
	import type { ActionData } from './$types'
	import type { FlattenedNoteFormErrors } from './+page.server'

	export let form: ActionData
	let title = ''
	let content = ''
	let errors: FlattenedNoteFormErrors | null = null
	const [titleId, contentId] = [crypto.randomUUID(), crypto.randomUUID()]

	$: {
		title = form?.data.title.toString() ?? ''
		content = form?.data.content.toString() ?? ''
		errors = form?.errors ?? null
	}
</script>

<form method="POST" use:enhance>
	<h3>Doot a new note 📯</h3>
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
		Create note <Plus />
	</Button>
</form>

<style>
	h3 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}
</style>
