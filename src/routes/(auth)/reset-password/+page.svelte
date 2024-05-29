<script lang="ts">
	import { Button, Input, ValidationErrors } from '$lib/components'
	import { superForm } from 'sveltekit-superforms'
	export let data

	const { form, errors, constraints, enhance, message } = superForm(
		data.resetPasswordForm,
	)
	const formId = 'forgot-password-form'
	// TODO: create a auth form component to reduce styling repeats 😎
</script>

<h1>Reset Password</h1>
<p>
	Don't worry, I forget my password all the time {data.resetPasswordUsername},
	let's get you sorted out by dooting a new one.
</p>
<form method="POST" use:enhance id={formId}>
	<div class="field-group">
		<Input
			label="New password"
			name="password"
			type="password"
			bind:value={$form.password}
			errors={$errors.password}
			{...$constraints}
		/>
	</div>
	<div class="field-group">
		<Input
			label="Confirm password"
			name="confirm"
			type="password"
			bind:value={$form.confirm}
			errors={$errors.confirm}
			{...$constraints}
		/>
	</div>
	<Button fluid type="submit" secondary>Submit</Button>
	{#if $message}
		<ValidationErrors errorId={formId} errors={[$message]} />
	{/if}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin: 0 auto;
		width: 30vw;
		padding-top: var(--space-2xl);
	}

	h1 {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	p {
		text-align: center;
	}

	@media (max-width: 560px) {
		h1 {
			font-size: var(--type-step-6);
		}
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		width: 100%;
	}
</style>
