<script lang="ts">
	import LockClosed from 'virtual:icons/radix-icons/lockClosed'
	import LockOpened from 'virtual:icons/radix-icons/lock-open-1'
	import { Button } from '$lib/components/index.js'

	export let data
</script>

<main class="two-fa-wrapper">
	<h1>Two Factor Authentication</h1>
	{#if data.isTwoFactorEnabled}
		<p class="flex">
			<LockClosed /> Two Factor Authentication is enabled.
		</p>
		<Button href="disable" secondary>Disable 2FA</Button>
	{:else}
		<p class="flex">
			<LockOpened /> You haven't dooted on two-factor authentiaction yet.
		</p>
		<Button href="verify" secondary>Enable 2FA</Button>
	{/if}
</main>

<style>
	.two-fa-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
	}

	h1 {
		font-size: var(--type-step-2);
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		max-width: 48rem;
	}

	.flex {
		display: flex;
		align-items: center;
	}
</style>
