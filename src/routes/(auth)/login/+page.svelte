<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { page } from '$app/stores'
	import {
		Button,
		Input,
		ValidationErrors,
		HoneypotInputs,
		FormGroup,
	} from '$lib/components'
	import { LoginFormSchema } from '$lib/schemas.js'

	export let data
	const { form, errors, constraints, enhance, delayed, timeout } = superForm(
		data.loginForm,
		{
			validators: zodClient(LoginFormSchema),
			validationMethod: 'auto',
			delayMs: 300,
		},
	)
	const formId = 'login-form'
	// TODO: create a auth form component to reduce styling repeats 😎
</script>

<h1>Hello again!</h1>
<form method="POST" use:enhance id={formId}>
	<HoneypotInputs />
	<FormGroup>
		<Input
			label="Enter username"
			name="username"
			bind:value={$form.username}
			errors={$errors.username}
			constraints={$constraints.username}
			type="text"
		/>
	</FormGroup>
	<FormGroup>
		<Input
			label="Enter password"
			name="password"
			type="password"
			bind:value={$form.password}
			errors={$errors.password}
			constraints={$constraints.password}
		/>
	</FormGroup>
	<div class="remember-forgot">
		<div>
			<input
				bind:checked={$form.remember}
				name="remember"
				id="remember"
				type="checkbox"
				aria-invalid={$errors.remember ? 'true' : undefined}
				{...$constraints.remember}
			/>
			<label for="remember">Remember me</label>
		</div>
		<div>
			<a href="/forgot-password">Forgot password?</a>
		</div>
	</div>
	<Input type="hidden" name="redirectTo" value={$page.params.redirectTo} />
	<Button
		fluid
		type="submit"
		variant="secondary"
		delayed={$delayed || $timeout}
		delayedReason="Logging in"
	>
		Submit
	</Button>
	<ValidationErrors errorId={formId} errors={$errors._errors} />
	<span class="signup">
		New here? <a href="/signup" class="link">Create an account</a>
	</span>
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

	.remember-forgot {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-bottom: var(--space-2xs);
	}

	.link {
		color: var(--palette-pop);
	}

	.signup {
		margin-top: var(--space-s);
	}
</style>
