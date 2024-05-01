<script lang="ts">
	import { Button } from '$lib/components'
	import { getUserImgSrc } from '$lib/utils/misc'
	import type { PageData } from './$types'
	import Pencil from 'virtual:icons/radix-icons/pencil2'

	export let data: PageData
	const profileSrc = getUserImgSrc(data.user.id)
</script>

<!-- TODO: PICKUP HERE: Trying to get the photo change cranking -->
<div class="photo-change-wrapper">
	<div class="avatar-wrapper">
		<img class="avatar" src={profileSrc} alt="{data.user.name}'s avatar" />
	</div>
	<form method="POST">
		<input
			accept="image/*"
			required
			tabIndex={newImageSrc ? -1 : 0}
		/>
		<Button type="submit"><Pencil />Change</Button>
	</form>
</div>

<style>
	.photo-change-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
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
</style>
