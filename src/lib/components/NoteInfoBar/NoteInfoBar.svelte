<div class="info-bar">
	<slot />
</div>

<style>
	.info-bar {
		grid-column: 1 / 4;
		grid-row: 2 / span 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		bottom: var(--space-m);
		left: var(--space-xl);
		right: var(--space-xl);
		padding: var(--space-s);
		border-radius: var(--border-radius);
		z-index: 1;
		backdrop-filter: blur(3px);
		background: hsl(0, 0%, 100%, 0.4);
		border: 2px solid white;
	}
</style>
