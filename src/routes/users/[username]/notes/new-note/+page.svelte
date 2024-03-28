<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../$types'

	export let form: ActionData
	let title = ''
	let content = ''
	let errors: { title: string[]; content: string[] }
	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
</script>

<pre>
	{JSON.stringify(form, null, 2)}
</pre>
<EditNote
	{action}
	newNote
	title={form?.result.initialValue.title}
	content={form?.result.initialValue.content}
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
