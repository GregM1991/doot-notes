<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import {
		Input,
		Button,
		ValidationErrors,
		HoneypotInputs,
		FormGroup,
	} from '$lib/components'
	import { OnboardingSchema } from '$lib/schemas'

	const { data } = $props()
	const { form, formId, errors, enhance, constraints } = superForm(data.form, {
		validators: zodClient(OnboardingSchema),
	})
	let redirectTo = $state($form.redirectTo ?? '')
</script>

<h1>Great to have you <br /> {data.email}</h1>
<span>Go ahead and enter your details for us</span>
<form id={$formId} method="POST" use:enhance>
	<HoneypotInputs />
	<FormGroup>
		<Input
			label="Username"
			name="username"
			bind:value={$form.username}
			errors={$errors.username}
			constraints={$constraints.username}
			type="text"
		/>
	</FormGroup>
	<FormGroup>
		<Input
			label="Name"
			name="name"
			bind:value={$form.name}
			errors={$errors.name}
			type="text"
		/>
	</FormGroup>
	<FormGroup>
		<Input
			type="password"
			label="Password"
			name="password"
			bind:value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>
	</FormGroup>
	<FormGroup>
		<Input
			type="password"
			label="Confirm Password"
			name="confirm"
			bind:value={$form.confirm}
			errors={$errors.confirm}
			constraints={$constraints.confirm}
		/>
	</FormGroup>
	<label>
		Do you agree to our Terms of Service and Privacy Policy?
		<input
			aria-invalid={$errors.agreeToTermsOfServiceAndPrivacyPolicy
				? 'true'
				: undefined}
			bind:checked={$form.agreeToTermsOfServiceAndPrivacyPolicy}
			name="agreeToTermsOfServiceAndPrivacyPolicy"
			type="checkbox"
			{...$constraints.agreeToTermsOfServiceAndPrivacyPolicy}
		/>
		<ValidationErrors
			errors={$errors.agreeToTermsOfServiceAndPrivacyPolicy}
			errorId="agreeToTermsOfServiceAndPrivacyPolicy"
		/>
	</label>
	<label>
		<input
			aria-invalid={$errors.agreeToTermsOfServiceAndPrivacyPolicy
				? 'true'
				: undefined}
			bind:checked={$form.remember}
			name="remember"
			type="checkbox"
			{...$constraints.remember}
		/>
		Remember me?
	</label>
	<Input bind:value={redirectTo} name="redirectTo" type="hidden" />
	<Button type="submit" variant="secondary" fluid>Submit</Button>
	<ValidationErrors errorId={$formId} errors={$errors._errors} />
</form>

<style>
	h1 {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	span {
		text-align: center;
		display: block;
	}
</style>
