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
		<Button href="two-factor/disable" secondary>Disable 2FA</Button>
	{:else}
		<form class="form" method="POST">
			<p class="flex">
				<LockOpened /> You haven't dooted on two-factor authentiaction yet.
			</p>
			<p>
				Two factor authentication is a great way to doot another level of
				security to your account. For this extra layer you will need an app like <a
					href="https://1password.com">1Password</a
				> to generate a code to use when logging in.
			</p>
			<Button type="submit" secondary>
				Enable 2FA
			</Button>
		</form>
	{/if}
</main>

<style>
	.two-fa-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		text-align: center;
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
