<script lang="ts">
	import { Navbar, Toast } from '$lib/components'
	import type { HoneypotInputProps } from '$lib/server/honeypot.js'
	import { dismissToast, toasts } from '$lib/stores/toast.js'
	import '$lib/styles/app.css'
	import { setContext } from 'svelte'
	import { readable, type Readable } from 'svelte/store'

	export let data

	const honeyProps = readable(data.honeyProps)
	setContext<Readable<HoneypotInputProps>>('honeyProps', honeyProps)
	$: console.log({ toasts: $toasts })
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}
	<!-- <link rel="preload" href="/src/lib/components/icons/sprite.svg" as="image" /> -->
	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div class="content">
	{#each $toasts as toast}
		<Toast
			title={toast.title}
			description={toast.description}
			type={toast.type}
			on:close={() => dismissToast(toast.id)}
		/>
	{/each}
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
