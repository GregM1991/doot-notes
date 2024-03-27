<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '$lib/components'
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
		{#if $page.data.user}
			{$page.data.user.name}
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
		gap: var(--space-l)
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
</style>
