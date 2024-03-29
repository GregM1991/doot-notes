<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../$types'

	export let form: ActionData

	let note = form?.result ? {
		id: null,
		title: form.result.intialData.title,
		content:  form.result.intialData.content
	} : null
	let errors: { title: string[]; content: string[] }
	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
</script>

<pre>
	{JSON.stringify(form, null, 2)}
</pre>
<EditNote
	{action}
	{note}
	errors={form?.result.error}
/>

<style>
	pre {
		position: absolute;
		z-index: 10;
		background: white;
		padding: 30px;
	}
</style>
