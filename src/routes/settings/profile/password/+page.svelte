<script lang="ts">
	import { Button, FormGroup, Input } from '$lib/components'
	import { superForm } from 'sveltekit-superforms'

	export let data
	const { form, errors, enhance, constraints } = superForm(
		data.editPasswordForm,
	)
</script>

<h1 class="header">Let's make some changes to your profile</h1>
<form method="POST" use:enhance>
	<FormGroup>
		<Input
			fluid
			label="Current Password"
			name="currentPassword"
			type="password"
			bind:value={$form.currentPassword}
			errors={$errors.currentPassword}
			constraints={$constraints.currentPassword}
		/>
	</FormGroup>
	<FormGroup>
		<Input
			fluid
			label="New Password"
			name="newPassword"
			type="password"
			bind:value={$form.newPassword}
			errors={$errors.newPassword}
			constraints={$constraints.newPassword}
		/>
	</FormGroup>
	<FormGroup>
		<Input
			fluid
			label="Confirm New Password"
			name="confirmNewPassword"
			type="password"
			bind:value={$form.confirmNewPassword}
			errors={$errors.confirmNewPassword}
			constraints={$constraints.confirmNewPassword}
		/>
	</FormGroup>
	<div class="button-wrapper">
		<a class="link-button" href=".">Cancel</a>
		<Button secondary type="submit">Change Password</Button>
	</div>
</form>

<style>
	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
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
