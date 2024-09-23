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
	import { twoFAVerificationType } from '$lib/profile/consts'

	let { data } = $props()
	const { form, errors, enhance, constraints, formId } = superForm(
		data.verifyForm,
		{
			validators: zodClient(VerifySchema),
		},
	)
	let redirectTo = $state($form.redirectTo ?? '')
</script>

{#if $form.type !== twoFAVerificationType}
	<h1 class="header">Have a geez at your email</h1>
	<span class="copy">
		We've sent you a little prezzie to your email address to verify it's really
		you 😉
	</span>
{:else}
	<h1 class="header">Check your 2FA app</h1>
	<p class="copy">Please enter your 2FA code to verify your identity.</p>
{/if}
<form method="POST" use:enhance>
	<HoneypotInputs />
	<FormGroup>
		<Input
			name="code"
			bind:value={$form.code}
			label="Enter Code"
			errors={$errors.code}
			constraints={$constraints.code}
			type="text"
		/>
	</FormGroup>
	<Input type="hidden" name="type" value={$form.type} />
	<Input type="hidden" name="target" value={$form.target} />
	<Input type="hidden" name="redirectTo" value={redirectTo} />
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
