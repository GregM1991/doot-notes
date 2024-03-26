<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input, ValidationErrors } from '$lib/components'

	export let form
	const formId = "login-form"
	const formErrors = form ? form?.data.errors.formErrors : null
</script>

<pre>
	{JSON.stringify(formErrors, null, 2)}
</pre>

<form method="POST" use:enhance id={formId}>
	<h1>Hello again!</h1>
	<div class="field-group">
		<Input
			label="Enter username"
			id="username"
			name="username"
			value={form?.data.formData.username ?? ''}
      errors={form?.data?.errors.fieldErrors.username}
      required
		/>
	</div>
	<div class="field-group">
		<Input
			label="Enter password"
			id="password"
			name="password"
			type="password"
      errors={form?.data?.errors.fieldErrors.password}
      required
		/>
	</div>
	<div class="remember-forgot">
    <div>
      <input name="remember" id="remember" type="checkbox" />
      <label for="remember">Remember me</label>
    </div>
    <div>
      <a href="/forgot-password">Forgot password?</a>
    </div>
	</div>
	<Button fluid type="submit" secondary>Submit</Button>
	<ValidationErrors errorId={formId} errors={formErrors} />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		max-width: fit-content;
		margin: 0 auto;
		padding-top: var(--space-3xl);
	}

	h1 {
		font-size: var(--type-step-5);
		color: var(--palette-pop);
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
    margin-bottom: var(--space-2xs)
  }
</style>
