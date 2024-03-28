<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../../$types'
	import { page } from '$app/stores'
	export let form: ActionData
	const action = `/users/${$page.params.username}/notes/${$page.params.noteid}/edit?/newOrUpdate`
</script>

<EditNote
	{action}
	title={form?.result.initialValue.title}
	content={form?.result.initialValue.content}
	errors={form?.result.error}
/>
