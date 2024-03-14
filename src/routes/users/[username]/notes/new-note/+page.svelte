<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Input from '$lib/components/Input/Input.svelte'
	import Plus from 'virtual:icons/radix-icons/plus'

	let title = ''
	let body = ''
</script>

<form method="POST">
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
