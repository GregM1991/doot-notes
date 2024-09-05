<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'

	export let data
	const action = `/users/${$page.params.username}/notes/${$page.params.noteId}/edit?/newOrUpdate`
</script>

<EditNote {action} data={data.editNoteForm} images={data.images} />
