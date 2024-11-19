<script lang="ts">
	import { AnimatedLogo } from '$lib/components'
	import gsap from 'gsap'
	import { createPrefersReducedMotionStore } from '$lib/stores/prefersReducedMotion.store.svelte'

	let prefersReducedMotion = createPrefersReducedMotionStore()

	$effect(() => {
		if (prefersReducedMotion) return

		const tl = gsap.timeline()
		tl.to('.line-2', {
			duration: 0.2,
			opacity: 1,
			y: -15,
			ease: 'power1.out',
		}).to('.line-1', {
			duration: 0.2,
			opacity: 1,
			y: -15,
			ease: 'power1.out',
		}).to('.line-2', {
			duration: 0.3,
			opacity: 1,
			y: -15,
			ease: 'power1.out',
		})
	})
</script>

<main class="main">
	<AnimatedLogo />

	<div class="content">
		<h1
			class="header"
			style={`--opacity: ${prefersReducedMotion ? '1' : '0'};`}
		>
			<span class="line line-1">Welcome to</span><span class="line line-2">
				DootNotes</span
			>
		</h1>
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
		gap: var(--space-m);
		max-width: 72rem;
	}

	.header {
		--opacity: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		color: var(--palette-pop);
		font-family: var(--type-display);
		font-size: var(--type-step-6);
		line-height: var(--type-step-6);
		text-align: center;

		.line {
			opacity: var(--opacity);
		}
	}

	p {
		font-size: var(--type-step-1);
		text-align: center;
	}
</style>
