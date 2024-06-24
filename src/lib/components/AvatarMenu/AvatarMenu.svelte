<script lang="ts">
	import { getUserImgSrc } from '$lib/utils/misc'
	import { createDropdownMenu, melt } from '@melt-ui/svelte'
	import Person from 'virtual:icons/radix-icons/person'
	import Pencil from 'virtual:icons/radix-icons/pencil2'
	import Exit from 'virtual:icons/radix-icons/exit'

	export let userImageId: string | null = null
	export let username: string
	export let name: string

	const {
		elements: { menu, item, trigger, overlay },
	} = createDropdownMenu({
		positioning: {
			placement: 'bottom-start',
		},
	})
</script>

<a
	use:melt={$trigger}
	href="/users/{username}"
	on:click|preventDefault
	class="avatar"
>
	<img
		src={getUserImgSrc(userImageId)}
		alt={name ?? username}
		class="avatar-image"
	/>
	{name ?? username}
</a>
<div use:melt={$overlay} />
<div use:melt={$menu} class="dropdown">
	<a href="/users/{username}" use:melt={$item} class="menu-item">
		<Person /> Profile
	</a>
	<a href="/users/{username}/notes" use:melt={$item} class="menu-item">
		<Pencil /> Notes
	</a>
	<form action="/logout" method="POST">
		<button type="submit" use:melt={$item} class="menu-item">
			<Exit /> Logout
		</button>
	</form>
</div>

<style>
	.avatar {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		padding: var(--space-2xs);
		background: var(--palette-secondary);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
	}

	.avatar-image {
		width: 2rem;
		height: 2rem;
		object-fit: contain;
		border-radius: var(--border-radius-circle);
	}

	.dropdown {
		padding: var(--space-2xs) var(--space-xs);
		background: var(--palette-pop-extra-light);
		border-radius: var(--border-radius-small);
	}

	.dropdown {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.dropdown button {
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
	}

	.menu-item {
		display: flex;
		gap: var(--space-2xs);
		align-items: center;
	}
</style>
