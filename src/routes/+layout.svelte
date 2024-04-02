<script lang="ts">
	import { dev } from '$app/environment'
	import { Navbar, Toast } from '$lib/components'
	import '$lib/styles/app.css'
	import { onDestroy } from 'svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData
	const isMswEnabled = dev && import.meta.env.VITE_MSW_ENABLED === 'true'
	let timeoutId: ReturnType<typeof setTimeout>
	$: showToast = data.toast ? true : false

	// TODO: Clean this up
	function dismissToast() {
		showToast = false
	}

	$: if (data.toast) {
		if (timeoutId) clearTimeout(timeoutId)

		timeoutId = setTimeout(() => {
			dismissToast()
		}, 5000)
	}
	onDestroy(() => timeoutId && clearTimeout(timeoutId))

	let isReady = !isMswEnabled

	if (isMswEnabled) {
		import('$lib/server/msw')
			.then(res => res.inject())
			.then(() => (isReady = true))
	}
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}
	<!-- <link rel="preload" href="/src/lib/components/icons/sprite.svg" as="image" /> -->
	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div class="content">
	{#if showToast && data.toast}
		<Toast
			title={data.toast.title}
			description={data.toast.description}
			type={data.toast.type}
			on:close={dismissToast}
		/>
	{/if}
	<header>
		<Navbar />
	</header>
	<div class="content-body">
		{#if isReady}
			<slot />
		{/if}
	</div>
	<footer>I'm the 🦶er</footer>
</div>

<style>
	.content {
		display: grid;
		grid-template-columns: var(--space-xl) 1fr var(--space-xl);
		grid-template-rows: auto minmax(400px, 1fr) auto;
		grid-template-areas:
			'. header .'
			'. main .'
			'footer footer footer';
		gap: var(--space-xs);
		position: relative;
		height: 100vh;
		background: var(--palette-base);
	}

	header {
		grid-area: header;
		padding: var(--space-s) 0;
	}

	.content-body {
		grid-area: main;
	}

	footer {
		display: grid;
		place-items: center;
		grid-area: footer;
		padding: var(--space-xs);
	}
</style>
