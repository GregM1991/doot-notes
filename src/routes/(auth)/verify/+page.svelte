<script lang="ts">
	import {
		Input,
		Button,
		HoneypotInputs,
		FormGroup,
		ValidationErrors,
	} from '$lib/components'
	import { superForm } from 'sveltekit-superforms'
	import { VerifySchema } from '$lib/schemas'
	import { zodClient } from 'sveltekit-superforms/adapters'

	export let data
	const { form, errors, enhance, constraints, formId } = superForm(
		data.verifyForm,
		{
			validators: zodClient(VerifySchema),
		},
	)
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
			bind:value={$form.code}
			{label}
			errors={$errors.code}
			constraints={$constraints.code}
			type="text"
		/>
	</FormGroup>
	<Input type="hidden" name="type" bind:value={$form.type} hidden />
	<Input type="hidden" name="target" bind:value={$form.target} hidden />
	<Input type="hidden" name="redirectTo" bind:value={$form.redirectTo} hidden />
	<Button fluid variant="secondary" type="submit">Submit</Button>
	<ValidationErrors errorId={$formId} errors={$errors._errors} />
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
