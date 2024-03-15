<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input } from '$lib/components'
	import Plus from 'virtual:icons/radix-icons/plus'
	import type { ActionData } from './$types'
	import type { FlattenedNoteFormErrors } from './+page.server'

	export let form: ActionData
	let title = '';
  let content = '';
  let errors: FlattenedNoteFormErrors | null = null;
  let id = '';

  $: {
    title = form?.data.title.toString() ?? '';
    content = form?.data.content.toString() ?? '';
    errors = form?.errors ?? null;
  }
</script>

<pre>
	{JSON.stringify(form, null, 2)}
</pre>

<form method="POST" use:enhance>
	<h3>Doot a new note 📯</h3>
	<div class="form-group">
		<Input errors={errors?.title} label="Title" {id} secondary name="title" type="text" bind:value={title} />
	</div>
	<div class="form-group">
		<label for="content">Content</label>
		<textarea name="content" id="content" bind:value={content} />
	</div>
	<Button secondary type="submit">
		Create note <Plus />
	</Button>
</form>

<style>
	pre {
		padding: var(--space-xs);
		background: #eee;
		margin-bottom: var(--space-xs);
	}

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
