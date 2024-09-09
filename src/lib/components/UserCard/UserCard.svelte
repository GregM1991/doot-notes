<script lang="ts">
	import { getUserImgSrc } from '$lib/utils/misc'
	import type { UserCardProps } from './types.userCard'

	let { username, name, imageId }: UserCardProps = $props()
</script>

<a
	class="wrapper"
	data-sveltekit-preload-data="hover"
	href={`/users/${username}`}
>
	<span class="gravatar">
		<img src={getUserImgSrc(imageId)} alt={name ?? username} />
	</span>
	<span class="name">{name}</span>
	<span class="username">{username}</span>
</a>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-s);
		background: var(--palette-primary-ultra-light);
		border-radius: 1rem;
		border: var(--border-primary);
		text-align: center;
		font-weight: var(--type-weight-bold);
		height: 10rem;
		width: 12rem;

    @media (--below-med) {
      position: relative;
      height: auto;
      width: auto;
      padding: var(--space-l) var(--space-s) var(--space-xs);
    }
	}

	.gravatar {
		display: inline-block;
		margin-bottom: var(--space-2xs);
		font-size: 2rem;
		background: var(--palette-base);
		border-radius: var(--border-radius-circle);
		width: 4rem;
		height: 4rem;
    overflow: hidden;

    @media (--below-med) {
      position: absolute;
      top: -15px;
      width: 2.5rem;
      height: 2.5rem;
      border: var(--border-primary)
    }
	}

	.name {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		width: 100%;
	}

	.username {
		font-size: var(--type-step--1);
		font-weight: 400;
	}
</style>
