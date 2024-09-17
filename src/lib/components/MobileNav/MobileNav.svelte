<script lang="ts">
	import { fly } from 'svelte/transition'
	import Ham from './Ham.svelte'
	import { Button, Exit, Pencil2, Person } from '$lib/components'
	import type { User } from '@prisma/client'

	let {
		user = null,
	}: { user: (User & { image: { id: string } | null }) | null } = $props()

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
				<Button fluid href="/users" onclick={toggle}>Users</Button>
			</li>
			{#if user}
				<Button fluid href="/users/{user.username}" onclick={toggle}>
					<Person /> Profile
				</Button>
				<Button fluid href="/users/{user.username}/notes" onclick={toggle}>
					<Pencil2 /> Notes
				</Button>
				<form action="/logout" method="POST">
					<Button fluid type="submit" onclick={toggle}>
						<Exit /> Logout
					</Button>
				</form>
			{:else}
				<Button onclick={toggle} fluid href="/login">Login</Button>
			{/if}
		</ul>
	{/if}
</div>

<style>
	.mobile-nav {
		isolation: isolate;
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
