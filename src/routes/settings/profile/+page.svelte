<script lang="ts">
	import { Input, Button } from '$lib/components'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { superForm } from 'sveltekit-superforms'
	export let data
	const { form } = superForm(data.editProfileForm)
	const profileSrc = getUserImgSrc(data.user.id)
</script>

<form class="wrapper">
	<h1 class="header">Let's make some changes to your profile</h1>
	<img class="avatar" src={profileSrc} alt="{data.user?.name}'s avatar" />
	<div class="inputs">
		<!-- TODO: Should really incorporate this form group class into the inputF -->
		<div class="form-group">
			<Input name="username" type="text" bind:value={$form.username} />
		</div>
		<div class="form-group">
			<Input name="name" type="text" bind:value={$form.name} />
		</div>
	</div>
	<Button secondary fluid name="intent" value={profileUpdateActionIntent} type="submit">Save changes</Button>
</form>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3xs);
		max-width: 48rem;
		margin: 0 auto;
	}

	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.avatar {
		width: var(--space-3xl);
		height: var(--space-3xl);
		object-fit: contain;
	}

	.inputs {
		display: flex;
		gap: var(--space-xs);
		width: 100%;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
