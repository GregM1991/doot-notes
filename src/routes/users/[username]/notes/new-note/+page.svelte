<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'
	import { parseNewOrEditResult } from '$lib/components/EditNote/editNote.helpers'

	// TODO: Not sure why this isn't coming back typed from the action...
	export let form
	let note = {
		id: null,
		title: '',
		content: '',
		images: [{}],
	}

	if (form?.result?.initialValue) {
		note = parseNewOrEditResult(note, form.result.initialValue)
	}

	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
</script>

<EditNote {action} {note} errors={form?.result.error} />
