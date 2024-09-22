<div class="info-bar">
	<slot />
</div>

<style>
	.info-bar {
		position: absolute;
		display: flex;
		justify-content: space-between;
		align-items: center;
		bottom: var(--space-m);
		left: var(--space-m);
		right: var(--space-m);
		padding: var(--space-s);
		border-radius: var(--border-radius);
		backdrop-filter: blur(3px);
		background: hsl(0, 0%, 100%, 0.4);
		border: 2px solid white;
		box-shadow: var(--shadow-base);
	}
</style>
