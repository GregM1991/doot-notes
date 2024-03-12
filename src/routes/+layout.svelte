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

<div class="content">
	<header>
		<Navbar />
	</header>
	<div class="content-body">
		<slot />
	</div>
	<footer>
		I'm the 🦶er
	</footer>
</div>

<style>
	.content {
		display: grid;
		grid-template-columns: var(--space-3xl) 1fr var(--space-3xl);
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			'gutter1 header gutter2'
			'gutter1 main gutter2'
			'footer footer footer';
		gap: var(--space-xs);
		height: 100vh;
		background: var(--palette-base);
	}

	header {
		grid-area: header;
		padding: var(--space-s) 0;
	}

	.content-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		grid-area: main;
		padding-top: var(--space-3xl);
	}

	footer {
		display: grid;
		place-items: center;
		grid-area: footer;
		padding: var(--space-xs);
	}
</style>
