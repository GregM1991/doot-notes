<script lang="ts">
	import { Input, Button } from '$lib/components'
	import { getUserImgSrc } from '$lib/utils/misc'
	import { superForm } from 'sveltekit-superforms'
	export let data
	const { form } = superForm(data.editProfileForm)
	const profileSrc = getUserImgSrc(data.user.id)
</script>

<div class="wrapper">
  <h1 class="header">Let's make some changes to your profile</h1>
  <img class="avatar" src={profileSrc} alt="{data.user?.name}'s avatar" />
  <Input name="username" type="text" bind:value={$form.username} />
  <Input name="name" type="text" bind:value={$form.name} />
  <Button type="submit">Save changes</Button>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
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
</style>
