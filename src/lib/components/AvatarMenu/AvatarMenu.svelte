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

	function handleClick() {
		console.log('Clicked on avatar')
	}
</script>

<a
	use:melt={$trigger}
	href="/users/{username}"
	on:click|preventDefault={handleClick}
	class="avatar"
>
	<img src={getUserImgSrc(userImageId)} alt="{name ?? username}" class="avatar-image" />
	{name}
</a>
<div use:melt={$overlay} />
<div use:melt={$menu} class="dropdown">
	<ul>
		<li>
			<a href="/users/{username}" use:melt={$item} class="menu-item"
				><Person /> Profile</a
			>
		</li>
		<li>
			<a href="/users/{username}/notes" use:melt={$item} class="menu-item"
				><Pencil /> Notes</a
			>
		</li>
		<li>
			<form action="/logout" method="POST">
				<button type="submit" use:melt={$item} class="menu-item"
					><Exit /> Logout</button
				>
			</form>
		</li>
	</ul>
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
	}

	.dropdown {
		padding: var(--space-2xs) var(--space-xs);
		background: var(--palette-pop-extra-light);
		border-radius: var(--border-radius-small);
	}

	.dropdown ul {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		list-style: none;
		padding: 0;
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
