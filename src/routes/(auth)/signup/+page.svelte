<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Input, ValidationErrors } from '$lib/components'

	export let form
	const formId = 'sigup-form'
</script>

<svelte:head>
	<title>📯 Dootnotes | signup 📯</title>
</svelte:head>

<h1>Let's get you Dootin!</h1>
<form method="POST" use:enhance>
	<div class="field-group">
		<Input
			label="Enter your email"
			name="email"
			value=""
			errors={form?.result.error?.username}
		/>
	</div>
	<Button fluid type="submit" secondary>Submit</Button>
	<ValidationErrors errorId={formId} errors={form?.result.error?.['']} />
	<!-- TODO: this is a bit stinky -->
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
