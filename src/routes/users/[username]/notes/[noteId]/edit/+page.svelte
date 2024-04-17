<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../../$types'
	import { page } from '$app/stores'

	export let data
	export let form: ActionData
	const action = `/users/${$page.params.username}/notes/${$page.params.noteId}/edit?/newOrUpdate`
</script>

<EditNote {action} note={data.note} errors={form?.result.error} />
