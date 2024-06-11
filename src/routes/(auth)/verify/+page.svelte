<script script="ts">
	import {
		Input,
		Button,
		HoneypotInputs,
		FormGroup,
		ValidationErrors,
	} from '$lib/components'
	import { superForm } from 'sveltekit-superforms'

	export let data

	const { form, errors, enhance, constraints } = superForm(data.verifyForm)
	const label = 'Enter Code'
</script>

<h1 class="header">Have a geez at your email</h1>
<span class="copy">
	We've sent you a little prezzie to your email address to verify it's really
	you 😉
</span>
<form method="POST" use:enhance>
	<HoneypotInputs />
	<FormGroup>
		<Input
			name="code"
			value={$form.code}
			{label}
			errors={$errors.code}
			constraints={$constraints.code}
			type="text"
		/>
	</FormGroup>
	<Input name="type" value={$form.type} hidden/>
	<Input name="target" value={$form.target} hidden/>
	<Input name="redirectTo" value={$form.redirectTo} hidden/>
	<Button fluid secondary type="submit">Submit</Button>
	<ValidationErrors errors={$errors._errors} />
</form>

<style>
	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.copy {
		text-align: center;
		display: block;
	}
</style>
