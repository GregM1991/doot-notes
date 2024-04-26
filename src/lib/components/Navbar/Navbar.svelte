<script lang="ts">
	import { AvatarMenu, Button } from '$lib/components'
	import type { User } from '@prisma/client'

	export let user:
		| (User & { image: { id: string } | null })
		| null = null
</script>

<nav>
	<a href="/" class="logo">
		<span class="line top"> Doot</span>
		<span class="line bottom">Notes</span>
	</a>
	<div class="right-nav-group">
		<span class="right-links">
			<a href="/users" class="nav-link">Users</a>
		</span>
		{#if user}
			<AvatarMenu
				username={user.username}
				userImageId={user.image?.id}
				name={user.name}
			/>
		{:else}
			<Button href="/login">Login</Button>
		{/if}
	</div>
</nav>

<style>
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
		color: var(--palette-primary);
		font-weight: var(--type-weight-bold);
	}

	.right-nav-group {
		display: flex;
		align-items: center;
		gap: var(--space-l);
	}

	.line {
		display: flex;
		position: relative;
		align-items: center;
	}

	.line.top::before {
		content: '📯';
		position: absolute;
		left: -35px;
	}

	.line.bottom::after {
		content: '📯';
		position: absolute;
		right: -30px;
	}

	.right-links {
		display: flex;
		gap: var(--space-l);
	}

	.nav-link {
		transition: all 100ms ease-out;
	}

	.nav-link:hover {
		color: var(--palette-primary);
	}
</style>
