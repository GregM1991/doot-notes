<script lang="ts">
	// import { Plus } from '$lib/components'
	// const maxSizeMB = 50

	// let error: string | null = $state(null)
	// let video: File | null = $state(null)

	let { id }: { id: string | undefined } = $props()
</script>

{#if id}
	<input type="hidden" {id} name="video.id" value={id} />
{/if}
<label class="video-label">
	Upload Video
	<input
		id="video-upload"
		name="video.file"
		type="file"
		accept="video/*"
		aria-label="Image"
	/>
</label>
