<script lang="ts">
	import { Button, Input, ValidationErrors } from '$lib/components'
	import { superForm } from 'sveltekit-superforms'
	import type { PageData } from './$types'

	export let data: PageData
	const { form, errors, enhance, message } = superForm(data.changeEmailForm)
</script>

<div class="wrapper">
	<div class="copy">
		<h1 class="header">Change Email</h1>
		<p>
			So you wanna change your email huh? You will receive an email at the new
			email address to confirm
		</p>
		<p>An email notice will also be sent to your old address {data.user.email}</p>
	</div>
	<form id="change-email" method="POST" class="form" use:enhance>
		<div class="form-group">
			<Input
				label="New Email"
				name="email"
				type="text"
				bind:value={$form.email}
				errors={$errors.email}
			/>
		</div>
		<div class="button-wrapper">
			<Button secondary type="submit">Change Password</Button>
		</div>
		{#if $message}
			<ValidationErrors errorId="change-email" errors={$message} />
		{/if}
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
	}

	.copy {
		text-align: center;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3xs);
		max-width: 48rem;
		width: 30rem;
	}

	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
	}

	.button-wrapper {
		display: flex;
		gap: var(--space-s);
	}
</style>
