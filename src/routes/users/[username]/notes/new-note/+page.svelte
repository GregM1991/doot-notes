<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'

	export let data

	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
</script>

<EditNote {action} data={data.newNoteForm} images={data.images} />
