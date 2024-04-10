<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, Button, ValidationErrors } from '$lib/components'

	export let data
	export let form

	const username = 'username'
	const name = 'name'
	const password = 'password'
	const confirm = 'confirm'
	const formId = 'signup'
</script>

<h1>Great to have you <br /> {data.email}</h1>
<span>Go ahead and enter your details for us</span>
<form id={formId} method="POST" use:enhance>
	<div class="field-group">
		<Input
			label="Username"
			name={username}
			value={form?.result?.initialValue?.username ?? ''}
			errors={form?.result?.error?.username}
		/>
	</div>
	<div class="field-group">
		<Input
			label="Name"
			{name}
			value={form?.result?.initialValue?.name ?? ''}
			errors={form?.result?.error?.name}
		/>
	</div>
	<div class="field-group">
		<Input
			type="password"
			label="Password"
			name={password}
			value={form?.result?.initialValue?.password ?? ''}
			errors={form?.result?.error?.password}
		/>
	</div>
	<div class="field-group">
		<Input
			type="password"
			label="Confirm Password"
			name={confirm}
			value={form?.result?.initialValue?.confirm ?? ''}
			errors={form?.result?.error?.confirm}
		/>
	</div>
	<label>
		<input name="agreeToTermsOfServiceAndPrivacyPolicy" type="checkbox" />
		Do you agree to our Terms of Service and Privacy Policy?
		<ValidationErrors
			errors={form?.result?.error?.agreeToTermsOfServiceAndPrivacyPolicy}
			errorId="agreeToTermsOfServiceAndPrivacyPolicy"
		/>
	</label>
	<label>
		<input name="remember" type="checkbox" />
		Remember me?
	</label>
	<Input name="redirectTo" type="hidden" />
	<Button secondary fluid>Submit</Button>
	<ValidationErrors errorId={formId} errors={form?.result.error?.['']} />
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

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin: 0 auto;
		width: 30vw;
		padding-top: var(--space-2xl);
	}

	.field-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		width: 30vw;
	}
</style>
