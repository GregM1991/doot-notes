<script lang="ts">
	import { Button } from '$lib/components'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { fileProxy, superForm } from 'sveltekit-superforms'
	import type { PageData } from './$types'
	import Pencil from 'virtual:icons/radix-icons/pencil2'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { NewImageSchema } from '$lib/profile/schemas'

	export let data: PageData
	const { form, enhance, errors } = superForm(data.form, {
    validators: zodClient(NewImageSchema)
  })

const file = fileProxy(form, 'photoFile')
</script>

<!-- TODO: PICKUP HERE: Trying to get the photo change cranking -->
<div class="photo-change-wrapper">
	<div class="avatar-wrapper">
		<img class="avatar" src={data.user ? getUserImgSrc(data.user.image?.id) : ''} alt="{data.user.name}'s avatar" />
	</div>
	<form method="POST" enctype="multipart/form-data" use:enhance>
		<input
			accept="image/*"
			required
			tabIndex={$file ? -1 : 0}
			type="file"
			bind:files={$file}
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
