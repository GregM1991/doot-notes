<script lang="ts">
	import { fly } from 'svelte/transition'
	import Ham from './Ham.svelte'
	import { Button } from '$lib/components'
	let isActive = $state(false)

	function toggle() {
		isActive = !isActive
	}
</script>

<div class="mobile-nav">
	<Ham {isActive} toggleActive={toggle} />

	{#if isActive}
		<ul id="menu" class="menu" transition:fly={{ opacity: 0, x: '100%' }}>
			<li>
				<Button fluid href="/" onclick={toggle}>Doot Notes</Button>
			</li>
			<li>
				<Button fluid href="/users" class="nav-link" onclick={toggle}
					>Users</Button
				>
			</li>
		</ul>
	{/if}
</div>

<style>
	.mobile-nav {
		@media (--above-med) {
			display: none;
		}
	}

	.menu {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		inset: 0;
		width: 100vw;
		height: 100vh;
		background-color: var(--palette-base);
		padding: var(--space-xl);
		padding-top: var(--space-3xl);
		list-style: none;
		width: 100%;

		li {
			width: 100%;
		}
	}
</style>
