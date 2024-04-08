<script lang="ts">
	import { enhance } from '$app/forms'
	import { Input, Button } from '$lib/components'

	export let data
	const username = 'username'
	const name = 'name'
	const password = 'password'
	const confirm = 'confirm'
</script>

<h1>Great to have you <br /> {data.email}</h1>
<span>Go ahead and enter your details for us</span>
<form method="POST" use:enhance>
	<div class="field-group">
		<Input label="Username" name={username} />
	</div>
	<div class="field-group">
		<Input label="Name" {name} />
	</div>
	<div class="field-group">
		<Input label="Password" name={password} />
	</div>
	<div class="field-group">
		<Input label="Confirm Password" name={confirm} />
	</div>
	<Button secondary fluid>Submit</Button>
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

	.field-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		width: 30vw;
	}
</style>
