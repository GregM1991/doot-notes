<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { ActionData } from '../../$types'
	import { page } from '$app/stores'
	export let form: ActionData
	const action = `/users/${$page.params.username}/notes/${$page.params.noteid}/edit?/newOrUpdate`
</script>

<EditNote
	{action}
	note={$page.data.note}
	errors={form?.result.error}
/>
