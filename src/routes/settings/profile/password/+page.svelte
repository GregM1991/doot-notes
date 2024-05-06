<script lang="ts">
	import { Button, Input } from '$lib/components'
	import { superForm } from 'sveltekit-superforms'

	export let data
	const { form, errors, enhance } = superForm(data.editPasswordForm)
</script>

<div class="wrapper">
	<h1 class="header">Let's make some changes to your profile</h1>
	<form method="POST" class="form" use:enhance>
		<div class="form-group">
			<Input
				label="Current Password"
				name="currentPassword"
				type="password"
				bind:value={$form.currentPassword}
        errors={$errors.currentPassword}
			/>
		</div>
		<div class="form-group">
			<Input
				label="New Password"
				name="newPassword"
				type="password"
				bind:value={$form.newPassword}
        errors={$errors.newPassword}
			/>
		</div>
		<div class="form-group">
			<Input
				label="Confirm New Password"
				name="confirmNewPassword"
				type="password"
				bind:value={$form.confirmNewPassword}
        errors={$errors.confirmNewPassword}
			/>
		</div>
		<div class="button-wrapper">
			<a class="link-button" href="..">Cancel</a>
			<Button type="submit">Change Password</Button>
		</div>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3xs);
		max-width: 48rem;
		width: 30rem;
	}

	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
	}

  .button-wrapper {
		display: flex;
		gap: var(--space-s);
	}

	/* TODO: Find a way to clean this up (can Button take asChild prop?) */
  .link-button {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3xs);
		padding: var(--space-xs);
		background: tomato;
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		width: var(--width);
		font-size: var(--font-size);
		cursor: pointer;

		transition: var(--animation-quick);
	}

	.link-button:hover {
		filter: var(--border-drop-shadow-black-hover);
	}

	.link-button:focus {
		filter: var(--border-drop-shadow-black-hover);
		outline: none;
	}

	.link-button:active {
		filter: var(--border-drop-shadow-black-focus);
	}
</style>
