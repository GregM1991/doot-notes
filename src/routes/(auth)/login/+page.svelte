<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { page } from '$app/stores'
	import { Button, Input, ValidationErrors } from '$lib/components'
	
	export let data
	const { form, errors, constraints, enhance, message } = superForm(data.form)
	const formId = 'login-form'
	// TODO: create a auth form component to reduce styling repeats 😎
</script>

<h1>Hello again!</h1>
<form method="POST" use:enhance id={formId}>
	<div class="field-group">
		<Input
			label="Enter username"
			name="username"
			bind:value={$form.username}
			errors={$errors.username}
			{...$constraints}
		/>
	</div>
	<div class="field-group">
		<Input
			label="Enter password"
			name="password"
			type="password"
			bind:value={$form.password}
			errors={$errors.password}
			{...$constraints}
		/>
	</div>
	<div class="remember-forgot">
		<div>
			<input
				bind:value={$form.remember}
				name="remember"
				id="remember"
				type="checkbox"
			/>
			<label for="remember">Remember me</label>
		</div>
		<div>
			<a href="/forgot-password">Forgot password?</a>
		</div>
	</div>
	<Input name="redirectTo" type="hidden" value={$page.params.redirectTo} />
	<Button fluid type="submit" secondary>Submit</Button>
	{#if $message}
		<ValidationErrors errorId={formId} errors={[$message]} />
	{/if}
	<span class='signup'>
		New here? <a href="/signup" class="link">Create an account</a>
	</span>
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
