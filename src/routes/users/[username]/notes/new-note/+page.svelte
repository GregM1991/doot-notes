<script lang="ts">
	import { page } from '$app/stores'
	import { EditNote } from '$lib/components'
	import type { FlattenedNoteFormFieldErrors } from '$lib/components/EditNote/types'
	import type { ActionData } from '../$types'

	export let form: ActionData
	let title = ''
	let content = ''
	let errors: FlattenedNoteFormFieldErrors | null = null
	const action = `/users/${$page.params.username}/notes/new-note?/newOrUpdate`
	
	$: {
		title = form?.data.title.toString() ?? ''
		content = form?.data.content.toString() ?? ''
		errors = form?.errors ?? null
	}
</script>

<EditNote {action} {title} {content} {errors} />