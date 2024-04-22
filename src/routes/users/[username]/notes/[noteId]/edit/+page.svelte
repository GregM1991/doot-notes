<script lang="ts">
	import { EditNote } from '$lib/components'
	import { page } from '$app/stores'

	export let data

	const action = `/users/${$page.params.username}/notes/${$page.params.noteId}/edit?/newOrUpdate`
</script>

<EditNote {action} data={data.editNoteForm} />
