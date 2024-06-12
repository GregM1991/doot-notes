<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import {
		Button,
		Input,
		ValidationErrors,
		HoneypotInputs,
		FormGroup,
	} from '$lib/components'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { ForgotPasswordSchema } from '$lib/schemas'

	export let data
	const { form, errors, constraints, enhance } = superForm(
		data.forgotPasswordForm,
		{
			validators: zodClient(ForgotPasswordSchema),
		},
	)
	const formId = 'forgot-password-form'
	// TODO: create a auth form component to reduce styling repeats 😎
</script>

<h1>Whoopsies! Let's get you a new password</h1>
<form method="POST" use:enhance id={formId}>
	<HoneypotInputs />
	<FormGroup>
		<Input
			label="Enter username"
			name="usernameOrEmail"
			bind:value={$form.usernameOrEmail}
			errors={$errors.usernameOrEmail}
			constraints={$constraints.usernameOrEmail}
			type="text"
		/>
	</FormGroup>
	<Button fluid type="submit" secondary>Submit</Button>
	<ValidationErrors errorId={formId} errors={$errors._errors} />
</form>

<style>
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
</style>
