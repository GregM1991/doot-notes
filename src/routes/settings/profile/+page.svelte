<script lang="ts">
	import { Input, Button } from '$lib/components'
	import { profileUpdateActionIntent } from '$lib/profile/consts.js'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { superForm } from 'sveltekit-superforms'
	import Camera from 'virtual:icons/radix-icons/camera'

	export let data
	const { form } = superForm(data.editProfileForm)
	const profileSrc = getUserImgSrc(data.user.id)
</script>

<div class="wrapper">
	<h1 class="header">Let's make some changes to your profile</h1>
	<!-- TODO: Make component, use in photo/+page.svelte -->
	<div class="avatar-wrapper">
		<img class="avatar" src={profileSrc} alt="{data.user?.name}'s avatar" />
		<a href="/settings/profile/photo" class="update-photo-link">
			<Camera />
		</a>
	</div>
	<form class="form">
		<div class="inputs">
			<!-- TODO: Should really incorporate this form group class into the inputF -->
			<div class="form-group">
				<Input name="username" type="text" bind:value={$form.username} />
			</div>
			<div class="form-group">
				<Input name="name" type="text" bind:value={$form.name} />
			</div>
		</div>
		<Button
		secondary
		fluid
		name="intent"
		value={profileUpdateActionIntent}
		type="submit">Save changes</Button
		>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-l);
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3xs);
		max-width: 48rem;
	}

	.header {
		font-size: var(--type-step-4);
		color: var(--palette-pop);
		text-align: center;
	}

	.avatar-wrapper {
		justify-self: center;
		position: relative;
		width: 12rem;
		height: 12rem;
		text-align: center;
		border-radius: 9999px;
		background: var(--palette-base-light);
	}

	.avatar {
		display: grid;
		place-items: center;
		object-fit: contain;
		width: 100%;
		height: 100%;
	}

	.update-photo-link {
		display: grid;
		place-items: center;
		position: absolute;
		top: .5rem;
		right: .5rem;
		background: var(--palette-pop-light);
		width: 3rem;
		height: 3rem;
		border-radius: 9999px
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
