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

<h1>Have a geez at your email</h1>
<span>
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
		/>
	</FormGroup>
	<Input name="type" value={$form.type} type="hidden" />
	<Input name="target" value={$form.target} type="hidden" />
	<Input name="redirectTo" value={$form.redirectTo} type="hidden" />
	<Button fluid secondary type="submit">Submit</Button>
	<ValidationErrors errors={$errors._errors} />
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

	div {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
