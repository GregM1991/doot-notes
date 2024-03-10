<script>
	import { Navbar } from '$lib/components'
	import '$lib/styles/app.css'
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}
	<link rel="preload" href="/src/lib/components/icons/sprite.svg" as="image">
	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div>
	<header>
		<Navbar />
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: var(--space-3xl) 1fr var(--space-3xl);
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'header header header'
			'gutter1 main gutter2'
			'footer footer footer';
		height: 100vh;
		background: var(--palette-base);
	}

	header {
		grid-area: header;
		padding: var(--space-s) var(--space-3xl);
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		grid-area: main;
		padding-top: var(--space-3xl);
	}
</style>
