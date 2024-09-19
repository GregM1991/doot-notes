<script lang="ts">
	import { EditNote } from '$lib/components'
	import { page } from '$app/stores'

	let { data } = $props()
	const action = `/users/${$page.params.username}/notes/${$page.params.noteId}/edit?/newOrUpdate`
</script>

<EditNote {action} data={data.editNoteForm} images={data.images} />
