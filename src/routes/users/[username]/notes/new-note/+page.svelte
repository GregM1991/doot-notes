<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { FlattenedNoteFormErrors } from '$lib/components/EditNote/types'
	import type { ActionData } from '../$types'

	export let form: ActionData
	let title = ''
	let content = ''
	let errors: FlattenedNoteFormErrors | null = null

	$: {
		title = form?.data.title.toString() ?? ''
		content = form?.data.content.toString() ?? ''
		errors = form?.errors ?? null
	}
</script>

<EditNote {title} {content} {errors} />