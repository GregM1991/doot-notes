<main>
	<h1>Welcome to DootNotes 📯</h1>
	<p>
		DootNotes is a simple note-taking app that allows you to create, edit, and
		delete notes. You also can brose other users notes if you so wish! 🎉
	</p>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: var(--space-s);

		@media (--below-med) {
			padding: var(--space-m);
		}
	}

	h1 {
		color: var(--palette-pop);
		font-family: var(--type-primary);
		font-size: var(--type-step-4);
		text-align: center;
	}

	p {
		font-size: var(--type-step-1);
		text-align: center;
	}
</style>
