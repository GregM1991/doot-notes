<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input } from '$lib/components'
	import Plus from 'virtual:icons/radix-icons/plus'
	import type { ActionData } from './$types'
	
	export let form: ActionData
	let title = ''
	let body = ''
	let errors;

	console.log(form)
	if (form) {
		title = form.data.title.toString()
		body = form.data.body.toString()
		errors =form.errors
		console.log(errors)
	}

</script>

<pre>
	{JSON.stringify(form, null, 2)}
</pre>

<form method="POST" use:enhance>
	<h3>Doot a new note 📯</h3>
	<div class="form-group">
		<label for="title"> Title </label>
		<Input secondary name="title" type="text" bind:value={title} />
	</div>
	<div class="form-group">
		<label for="body"> Body </label>
		<textarea name="body" id="body" bind:value={body} />
	</div>
	<Button secondary type="submit">Create note <Plus /></Button>
</form>

<style>
	pre {
		padding:  var(--space-xs);
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
