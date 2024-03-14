<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte'
	import Plus from 'virtual:icons/radix-icons/plus'

	let title = ''
	let body = ''
</script>

<h2>Doot a new note 📯</h2>
<form method="POST">
	<label for="title"> Title </label>
	<input name="title" type="text" bind:value={title} />
	<label for="body"> Body </label>
	<textarea name="body" id="body" bind:value={body} />
	<Button type="submit">Create note <Plus /></Button>
</form>
