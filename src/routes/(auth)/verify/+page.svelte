<script script="ts">
	import { enhance } from '$app/forms'
	import { Input, Button } from '$lib/components'
	import { page } from '$app/stores'

	const label = 'Enter Code'
	export let form
	$: searchParams = {
		type: $page.url.searchParams.get('type'),
		target: $page.url.searchParams.get('target'),
		redirectTo: $page.url.searchParams.get('redirectTo'),
	}
</script>

<h1>Have a geez' at your email</h1>
<span>We've sent you a little prezzie to verify your email address</span>
<form method="POST" use:enhance>
	<div>
		<Input name="code" {label} errors={form?.result.error?.password} />
	</div>
	<Input name="type" value={searchParams?.type ?? ''} type="hidden" />
	<Input name="target" value={searchParams?.target ?? ''} type="hidden" />
	<Input
		name="redirectTo"
		value={searchParams.redirectTo ?? ''}
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
