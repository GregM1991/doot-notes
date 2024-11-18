<script lang="ts">
	import { AnimatedLogo } from '$lib/components'
</script>

<main class="main">
	<AnimatedLogo />

	<div class="content">
		<h1 class="header">Welcome to DootNotes</h1>
		<p>
			DootNotes is a simple note-taking app that allows you to create, edit, and
			delete notes. You also can browse other users notes if you so wish! 🎉
		</p>
	</div>
</main>

<style>
	.main {
		padding-top: var(--space-2xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xl);

		@media (--below-med) {
			padding: var(--space-m);
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		max-width: 72rem;
	}

	.header {
		color: var(--palette-pop);
		font-family: var(--type-display);
		font-size: var(--type-step-5);
		text-align: center;
	}

	p {
		font-size: var(--type-step-1);
		text-align: center;
	}
</style>
