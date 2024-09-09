<script lang="ts">
	import { Navbar, Toast } from '$lib/components'
	import '$lib/styles/app.css'
	import { onDestroy, setContext } from 'svelte'
	import type { HoneypotInputProps } from '$lib/server/honeypot.js'
	import { readable, type Readable } from 'svelte/store'

	export let data
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

	const honeyProps = readable(data.honeyProps)
	setContext<Readable<HoneypotInputProps>>('honeyProps', honeyProps)
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}
	<!-- <link rel="preload" href="/src/lib/components/icons/sprite.svg" as="image" /> -->
	<title>Let's doot some notes</title>
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
		<Navbar user={data.user} />
	</header>
	<div class="content-body">
		<slot />
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
		height: 100%;
		min-height: 100vh;
		background: var(--palette-base);

		@media (--below-med) {
			grid-template-columns: 1fr;
			grid-template-areas:
			'header'
			'main'
			'footer';
		}
	}

	header {
		grid-area: header;
		padding: var(--space-s) 0;
		z-index: 1;

		@media (--below-med) {
			padding: var(--space-m);
		}
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
