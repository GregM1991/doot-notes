<script lang="ts">
	import { Button, FormGroup, Input, ValidationErrors } from '$lib/components'
	import { superForm } from 'sveltekit-superforms'
	import type { PageData } from './$types'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { ChangeEmailSchema } from '$lib/schemas'

	export let data: PageData
	const { form, errors, enhance, constraints } = superForm(
		data.changeEmailForm,
		{
			validators: zodClient(ChangeEmailSchema),
		},
	)
</script>

<div class="copy">
	<h1 class="header">Change Email</h1>
	<p>
		So you wanna change your email huh? You will receive an email at the new
		email address to confirm
	</p>
	<p>An email notice will also be sent to your old address {data.user.email}</p>
</div>
<form id="change-email" method="POST" use:enhance>
	<FormGroup>
		<Input
			label="New Email"
			name="email"
			type="text"
			bind:value={$form.email}
			errors={$errors.email}
			constraints={$constraints.email}
		/>
	</FormGroup>
	<div class="button-wrapper">
		<Button variant="secondary" type="submit">Change Password</Button>
	</div>
	<ValidationErrors errorId="change-email" errors={$errors._errors} />
</form>

<style>
	.copy {
		text-align: center;
	}

	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.button-wrapper {
		display: flex;
		gap: var(--space-s);
	}
</style>
