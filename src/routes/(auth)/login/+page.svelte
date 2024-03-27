<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input, ValidationErrors } from '$lib/components'

	export let form
	const formId = "login-form"
</script>

<form method="POST" use:enhance id={formId}>
	<h1>Hello again!</h1>
	<div class="field-group">
		<Input
			label="Enter username"
			id="username"
			name="username"
			value={''}
      errors={['']}
      
		/>
	</div>
	<div class="field-group">
		<Input
			label="Enter password"
			id="password"
			name="password"
			type="password"
      errors={[""]}
      
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
	<ValidationErrors errorId={formId} errors={form?.data.formErrors} />
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
