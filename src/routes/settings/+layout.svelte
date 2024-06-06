<main class="wrapper">
	<slot />
</main>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
	}
</style>
