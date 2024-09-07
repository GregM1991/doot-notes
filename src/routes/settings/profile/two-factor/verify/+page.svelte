<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Button from '$lib/components/Button/Button.svelte'
	import { FormGroup, Input } from '$lib/components/index.js'
	import { TwoFactorVerifySchema } from '$lib/schemas.js'

	export let data
	const { form, errors, constraints, enhance } = superForm(
		data.verifyTwoFactorForm,
		{
			validators: zodClient(TwoFactorVerifySchema),
		},
	)
</script>

<div class="wrapper">
	<h1>Let's Verify Your Two Factor Authentication</h1>
	<img alt="qr code" src={data.qrCode} class="qr-code" />
	<p>
		Scan the QR code with your authenticator app to get your verification code.
		If this doesn't work, you can use the code below to manually doot this
		account to your authenticator app.
	</p>
	<pre>
		{data.otpUri}
	</pre>
	<p>
		After you've scanned the QR code or manually added the account, doot the
		verification code into the field below. Once you've done that, you will need
		to enter the code from your authenticator app every time you log in or
		perform important actions. Do not lose access to your authenticator app, or
		you will unfortunately lose access to this account 😢.
	</p>
	<form method="POST" use:enhance>
		<FormGroup>
			<Input
				label="Verification Code"
				name="code"
				bind:value={$form.code}
				type="text"
				errors={$errors.code}
				constraints={$constraints.code}
			/>
		</FormGroup>
		<Button variant="secondary" name="intent" value="verify" type="submit">
			Submit
		</Button>
		<Button variant="secondary" name="intent" value="cancel" type="submit">
			Cancel
		</Button>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		text-align: center;
		max-width: 1080px;
		margin: auto;
	}

	h1 {
		font-size: var(--type-step-2);
	}

	.qr-code {
		width: 300px;
		height: 300px;
	}

	pre {
		text-wrap: auto;
	}
</style>
