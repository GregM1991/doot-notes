<script lang="ts">
	import type { PageData } from './$types'
	let { data }: { data: PageData } = $props()
</script>

<h3>{data.videoMetadata.fileName}</h3>
<video controls src={getNoteVideoSrc(data.note.videoKey)} class="w-full">
	<track kind="captions" />
</video>
