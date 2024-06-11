<script lang="ts">
	import { Input, Button, FormGroup } from '$lib/components'
	import {
		deleteDataActionIntent,
		profileUpdateActionIntent,
		signOutOfSessionsActionIntent,
	} from '$lib/profile/consts.js'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { superForm } from 'sveltekit-superforms'
	import Camera from 'virtual:icons/radix-icons/camera'
	import DotsHorizontal from 'virtual:icons/radix-icons/dotsHorizontal'
	import EnvelopeClosed from 'virtual:icons/radix-icons/envelopeClosed'
	import Person from 'virtual:icons/radix-icons/person'
	import LockClosed from 'virtual:icons/radix-icons/lockClosed'
	import LockOpened from 'virtual:icons/radix-icons/lock-open-1'
	import Download from 'virtual:icons/radix-icons/download'
	import Link2 from 'virtual:icons/radix-icons/link-2'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { ProfileFormSchema } from '$lib/schemas.js'

	export let data
	const { form, enhance, errors, constraints } = superForm(data.form, {
		validators: zodClient(ProfileFormSchema),
		resetForm: false,
	})
	const profileSrc = getUserImgSrc(data.user.image?.id)
	$: otherSessions = data.user._count.sessions - 1
</script>

<h1 class="header">Let's make some changes to your profile</h1>
<!-- TODO: Make component, use in photo/+page.svelte -->
<div class="avatar-wrapper">
	<img class="avatar" src={profileSrc} alt="{data.user?.name}'s avatar" />
	<a href="/settings/profile/photo" class="update-photo-link">
		<Camera />
	</a>
</div>
<form id="profile" method="POST" use:enhance>
	<div class="inputs">
		<!-- TODO: Should really incorporate this form group class into the input -->
		<FormGroup>
			<Input
				label="Username"
				name="username"
				type="text"
				bind:value={$form.username}
				errors={$errors.username}
				constraints={$constraints.username}
			/>
		</FormGroup>
		<FormGroup>
			<Input
				label="Name"
				name="name"
				type="text"
				bind:value={$form.name}
				errors={$errors.name}
				constraints={$constraints.name}
			/>
		</FormGroup>
	</div>
	<Button
		secondary
		fluid
		name="intent"
		value={profileUpdateActionIntent}
		type="submit"
	>
		Save changes
	</Button>
</form>
<ul class="profile-links">
	<li>
		<a class="link" href="profile/password">
			<DotsHorizontal /> Change password
		</a>
	</li>
	<li>
		<a class="link" href="profile/change-email">
			<EnvelopeClosed /> Change email from {data.user.email}
		</a>
	</li>
	<li>
		<a class="link" href="profile/two-factor">
			{#if data.isTwoFactorEnabled}
				<LockClosed /> 2FA is enabled
			{:else}
				<LockOpened /> Enable 2FA
			{/if}
		</a>
	</li>
	<li class="link">
		{#if otherSessions}
			<Button
				small
				form="profile"
				name="intent"
				value={signOutOfSessionsActionIntent}
				type="submit">Sign out other sessions</Button
			>
		{:else}
			<Person /> This is your only session
		{/if}
	</li>
	<li>
		<a class="link" href="/settings/profile/connections">
			<Link2 /> Manage connections
		</a>
	</li>
	<li>
		<a
			download="my-doot-notes-data.json"
			class="link"
			href="/api/resources/download-user-data"
		>
			<Download /> Download your data
		</a>
	</li>
	<li>
		<Button
			form="profile"
			danger
			type="submit"
			small
			style="font-size: var(--type-step-0)"
			name="intent"
			value={deleteDataActionIntent}
		>
			<Download /> Delete your account and data
		</Button>
	</li>
</ul>

<style>
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
		border-radius: var(--border-radius-circle);
		background: var(--palette-base-light);
	}

	.avatar {
		display: grid;
		place-items: center;
		object-fit: cover;
		width: 100%;
		height: 100%;
		border-radius: var(--border-radius-circle);
	}

	.update-photo-link {
		display: grid;
		place-items: center;
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: var(--palette-pop-light);
		width: 3rem;
		height: 3rem;
		border-radius: var(--border-radius-circle);
	}

	.inputs {
		display: flex;
		gap: var(--space-xs);
		width: 100%;
	}

	.profile-links {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-s);
		width: 48rem;
		list-style: none;
	}

	.link {
		display: flex;
		align-items: center;
		gap: var(--space-3xs);
	}
</style>
