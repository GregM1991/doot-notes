<script lang="ts">
	import { page } from '$app/stores'
	import { Navbar, Toast } from '$lib/components'
	import '$lib/styles/app.css'

	$: toast = $page.data.dn_toast
	$: showToast = !!Object.keys(toast).length
	const handleClose = () => {
		console.log('hello?')
		showToast = false
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
	{#if showToast}
		<Toast
			title={toast.title}
			description={toast.description}
			type={toast.type}
			on:close={handleClose}
		/>
	{/if}
	<header>
		<Navbar />
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
