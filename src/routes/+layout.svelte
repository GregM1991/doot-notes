<script>
	import { Navbar } from '$lib/components'
	import '$lib/styles/app.css'
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}
	<link rel="preload" href="/src/lib/components/icons/sprite.svg" as="image" />
	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div class="content">
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
		grid-template-rows: 80px minmax(400px, 1fr) 50px;
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
		flex: 1 1 0%;
	}

	footer {
		display: grid;
		place-items: center;
		grid-area: footer;
		padding: var(--space-xs);
	}
</style>
