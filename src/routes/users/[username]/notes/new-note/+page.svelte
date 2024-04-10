<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../$types'

	export let form

	let note = form?.result
		? {
				id: null,
				title: form.result.intialData.title,
				content: form.result.intialData.content,
			}
		: null
	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
</script>

<EditNote {action} {note} errors={form?.result.error} />
