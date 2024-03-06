<script>
	import '$lib/styles/app.css'
</script>

<svelte:head>
	{#if !import.meta.env.Prod}
		<!-- TODO: Do dev things here if need -->
	{/if}

	<title>📯 Let's doot some notes 📯</title>
</svelte:head>

<div>
	<header>
		<nav>
			<a href="/" class="logo">
				<span class="line top"> Doot</span>
				<span class="line bottom">Notes</span>
			</a>
			<a href="/about" class="nav-link">About</a>
		</nav>
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: var(--space-3xl) 1fr var(--space-3xl);
		grid-template-rows: 80px 1fr 80px;
		grid-template-areas:
			'header header header'
			'gutter1 main gutter2'
			'footer footer footer';
		height: 100vh;
		background: var(--palette-base);
	}
	header {
		grid-area: header;
		background: var(--palette-secondary);
		padding: 0 var(--space-3xl);
	}
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100%;
	}

	.logo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		font-size: var(--type-step-0);
		color: var(--palette-pop);
		text-decoration: none;
		font-weight: var(--type-bold);
	}

	.line {
		display: flex;
		position: relative;
		align-items: center;
	}

	.line.top::before {
		content: "📯";
		position: absolute;
		left: -30px;
	}

	.line.bottom {
		/* TODO: do the horn after element */
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		grid-area: main;
		padding-top: var(--space-3xl);
	}
</style>
