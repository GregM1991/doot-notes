<main class="wrapper">
	<slot />
</main>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
		padding: 0 var(--space-l);
	}
</style>
