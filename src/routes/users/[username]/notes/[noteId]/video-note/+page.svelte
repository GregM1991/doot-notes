<script lang="ts">
	import { DoubleArrowLeft } from '$lib/components'
	import type { PageData } from './$types'
	let { data }: { data: PageData } = $props()
</script>

<div class="container">
	<a class="back-link" href="./"><DoubleArrowLeft /> Back to note</a>
	<h3 class="title">{data.fileName}</h3>
	<video class="video" controls src={data.videoUrl}>
		<track kind="captions" />
	</video>
</div>

<style>
	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-l);
		height: 100%;
	}

	.back-link {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		font-size: var(--type-step--1);
		position: absolute;
		top: -30px;
	}

	.title {
		font-size: var(--type-step-1);
	}

	.video {
		width: 100%;
		height: 100%;
	}
</style>
