<script lang="ts">
	import { Input } from '$lib/components'

	export let data
	const username = 'username'
	const name = 'name'
	const password = 'password'
	const confirm = 'confirm'
</script>

<h1>Great to have you <br /> {data.email}</h1>
<form action="POST">
	<Input label="Username" name={username} />
	<Input label="Username" {name} />
	<Input label="Username" name={password} />
	<Input label="Username" name={confirm} />
</form>

<style>
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

	h1 {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}
</style>
