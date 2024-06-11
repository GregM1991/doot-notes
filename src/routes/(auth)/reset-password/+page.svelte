<script lang="ts">
	import { Button, FormGroup, Input, ValidationErrors } from '$lib/components'
	import { LoginFormSchema } from '$lib/schemas.js'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'

	export let data
	const { form, errors, constraints, enhance, formId } = superForm(
		data.resetPasswordForm,
		{
		validators: zodClient(LoginFormSchema),
	}
	)
</script>

<h1>Reset Password</h1>
<p>
	Don't worry, I forget my password all the time {data.resetPasswordUsername},
	let's get you sorted out by dooting a new one.
</p>
<form method="POST" use:enhance id={$formId}>
	<FormGroup>
		<Input
			label="New password"
			name="password"
			type="password"
			bind:value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>
	</FormGroup>
	<FormGroup>
		<Input
			label="Confirm password"
			name="confirm"
			type="password"
			bind:value={$form.confirm}
			errors={$errors.confirm}
			constraints={$constraints.confirm}
		/>
	</FormGroup>
	<Button fluid type="submit" secondary>Submit</Button>
	<ValidationErrors errorId={$formId} errors={$errors._errors} />
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
</style>
