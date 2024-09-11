<script lang="ts">
	import { Button } from '$lib/components'
	import { page } from '$app/stores'

	let { data } = $props()
	let { name, username } = $derived(data.owner) // TODO: add user image
	let { userJoinedDisplay } = $derived(data)
	let isOwner = $state($page.data?.user?.id === data.owner.id)
</script>

<h1>{name}'s Profile</h1>
<main>
	<div class="user-info">
		<span>Username: {username}</span>
		<span class="date-joined">joined {userJoinedDisplay}</span>
	</div>
	<div class="buttons">
		<Button href={`${username}/notes`}>View {name}'s notes</Button>
		{#if isOwner}
			<Button href={`/settings/profile`}>Edit {name}'s profile</Button>
		{/if}
	</div>
</main>

<style>
	h1 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		text-align: center;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: var(--space-s);
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.date-joined {
		font-size: var(--type-step--1);
	}

	.buttons {
		display: flex;
		gap: var(--space-s);

		@media (--below-med) {
			flex-direction: column;
		}
	}
</style>
