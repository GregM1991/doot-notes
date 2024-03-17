<script lang="ts">
	import { EditNote } from '$lib/components'
	import type { PageData } from '../$types'

	export let data: PageData
</script>

<EditNote title={data.note.title} content={data.note.content} />
