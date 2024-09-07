<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import {
		Button,
		FormGroup,
		HoneypotInputs,
		Input,
		ValidationErrors,
	} from '$lib/components'
	import { SignupFormSchema } from '$lib/schemas.js'

	export let data
	const { form, formId, errors, enhance, constraints } = superForm(data.form, {
		validators: zodClient(SignupFormSchema),
	})
</script>

<svelte:head>
	<title>📯 Dootnotes | signup 📯</title>
</svelte:head>

<h1>Let's get you Dootin!</h1>
<form method="POST" use:enhance>
	<HoneypotInputs />
	<FormGroup>
		<Input
			label="Enter your email"
			name="email"
			bind:value={$form.email}
			errors={$errors.email}
			constraints={$constraints.email}
			type="text"
		/>
	</FormGroup>
	<Button fluid type="submit" variant="secondary">Submit</Button>
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
</style>
