<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { Button, Input, ValidationErrors, HoneypotInputs } from '$lib/components'

	export let data
	const { form, errors, constraints, enhance, message } = superForm(
		data.forgotPasswordForm,
	)
	const formId = 'forgot-password-form'
	// TODO: create a auth form component to reduce styling repeats 😎
</script>

<h1>Hello again!</h1>
<form method="POST" use:enhance id={formId}>
	<HoneypotInputs />
	<div class="field-group">
		<Input
			label="Enter username"
			name="usernameOrEmail"
			bind:value={$form.usernameOrEmail}
			errors={$errors.usernameOrEmail}
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
