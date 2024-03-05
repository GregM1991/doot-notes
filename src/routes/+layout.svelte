<script>
	import '$lib/assets/app.css'
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}

	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div>
	<header>
		<nav></nav>
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		display: grid;
		grid-template-areas:
			'header header header'
			'main main main'
			'footer footer footer';
		height: 100%;
	}
	nav {
		background: var(--palette-secondary);
	}

	main {
    display: flex;
    flex-direction: column;
    align-items: center;
		grid-area: main;
		background: var(--palette-base);
	}
</style>
