<script script="ts">
	import { Input, Button } from '$lib/components'
	import SuperDebug, { superForm } from 'sveltekit-superforms'

	export let data

	const { form, errors, enhance, message } = superForm(data.verifyForm)
	const label = 'Enter Code'
</script>

<h1>Have a geez at your email</h1>
<span>We've sent you a little prezzie to verify your email address</span>
<form method="POST" use:enhance>
	<div>
		<Input name="code" value={$form.code} {label} errors={$errors.code || $message?.text} />
	</div>
	<Input name="type" value={$form.type} type="hidden" />
	<Input name="target" value={$form.target} type="hidden" />
	<Input
		name="redirectTo"
		value={$form.redirectTo}
		type="hidden"
	/>
	<Button fluid secondary type="submit">Submit</Button>
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

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		margin: 0 auto;
		width: 30vw;
		padding-top: var(--space-2xl);
	}

	div {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
