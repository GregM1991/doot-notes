<script lang="ts">
	import {
		Input,
		Button,
		ValidationErrors,
		HoneypotInputs,
		FormGroup,
	} from '$lib/components'
	import { superForm } from 'sveltekit-superforms'

	export let data
	const { form, formId, errors, enhance } = superForm(data.form)
</script>

<h1>Great to have you <br /> {data.email}</h1>
<span>Go ahead and enter your details for us</span>
<form id={$formId} method="POST" use:enhance>
	<HoneypotInputs />
	<FormGroup>
		<Input
			label="Username"
			name="username"
			value={$form.username}
			errors={$errors.username}
		/>
	</FormGroup>
	<FormGroup>
		<Input label="Name" name="name" value={$form.name} errors={$errors.name} />
	</FormGroup>
	<FormGroup>
		<Input
			type="password"
			label="Password"
			name="password"
			value={$form.password}
			errors={$errors.password}
		/>
	</FormGroup>
	<FormGroup>
		<Input
			type="password"
			label="Confirm Password"
			name="confirm"
			value={$form.confirm}
			errors={$errors.confirm}
		/>
	</FormGroup>
	<label>
		<input name="agreeToTermsOfServiceAndPrivacyPolicy" type="checkbox" />
		Do you agree to our Terms of Service and Privacy Policy?
		<ValidationErrors
			errors={$errors.agreeToTermsOfServiceAndPrivacyPolicy}
			errorId="agreeToTermsOfServiceAndPrivacyPolicy"
		/>
	</label>
	<label>
		<input value={$form.remember} name="remember" type="checkbox" />
		Remember me?
	</label>
	<Input value={$form.redirectTo} name="redirectTo" type="hidden" />
	<Button type="submit" secondary fluid>Submit</Button>
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
