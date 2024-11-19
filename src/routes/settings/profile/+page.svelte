<script lang="ts">
	import {
		Input,
		Button,
		FormGroup,
		Person,
		Camera,
		DotsHorizontal,
		Download,
		EnvelopeClosed,
		Link2,
		LockClosed,
		LockOpened,
		Trash,
	} from '$lib/components'
	import {
		deleteDataActionIntent,
		profileUpdateActionIntent,
		signOutOfSessionsActionIntent,
	} from '$lib/profile/consts'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { ProfileFormSchema } from '$lib/schemas'
	import { createDoubleCheckStore } from '$lib/stores/doubleCheck.store.svelte'

	let { data } = $props()

	const [dcDeleteId, dcSignoutId] = ['delete', 'signOut']
	const dc = createDoubleCheckStore([dcDeleteId, dcSignoutId])

	const { form, enhance, errors, constraints } = superForm(data.form, {
		onSubmit: submitArgs => {
			if (submitArgs.submitter instanceof HTMLElement) {
				const attrs = Array.from(submitArgs.submitter.attributes)
				const attrsObject = Object.fromEntries(
					attrs.map(attr => [attr.name, attr.value]),
				)
				if (attrsObject.value === signOutOfSessionsActionIntent) {
					dc.handleSubmit(dcSignoutId)(submitArgs)
				} else {
					dc.handleSubmit(dcDeleteId)(submitArgs)
				}
			}
		},
		validators: zodClient(ProfileFormSchema),
		resetForm: false,
	})

	const profileSrc = getUserImgSrc(data.user.image?.id)
	let otherSessions = $derived(data.user._count.sessions - 1)
</script>

<h1 class="header">Let's make some changes to your profile</h1>
<!-- TODO: Make component, use in photo/+page.svelte -->
<div class="avatar-wrapper">
	<img class="avatar" src={profileSrc} alt="{data.user?.name}'s avatar" />
	<a href="/settings/profile/photo" class="update-photo-link">
		<Camera />
	</a>
</div>
<form id="profile" method="POST" use:enhance class="profile-form">
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
		variant="secondary"
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
				danger={dc.doubleCheckMap[dcSignoutId]}
				form="profile"
				name="intent"
				value={signOutOfSessionsActionIntent}
				type="submit"
				{...dc.getButtonProps(dcSignoutId)}
			>
				{#if dc.doubleCheckMap[dcSignoutId]}
					Are you sure?
				{:else}
					Sign out other sessions
				{/if}
			</Button>
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
			small
			form="profile"
			danger
			type="submit"
			name="intent"
			value={deleteDataActionIntent}
			{...dc.getButtonProps(dcDeleteId)}
		>
			{#if dc.doubleCheckMap[dcDeleteId]}
				Are you sure?
			{:else}
				<Trash /> Delete your account and data
			{/if}
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
		border: var(--border);
		filter: var(--border-drop-shadow-black);
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
		top: 3px;
		right: 3px;
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
		max-width: 32rem;
		width: 100%;
		list-style: none;

		/* @media (--below-med) {
			width: 100%;
		} */
	}

	.link {
		display: flex;
		align-items: center;
		gap: var(--space-3xs);
	}
</style>
