<script lang="ts">
	import type { Type } from '$lib/server/sessions/toast'
	import { createEventDispatcher } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	import Cross from 'virtual:icons/radix-icons/cross1'

	export let title: string | undefined
	export let description: string
	export let type: Type

	const dispatch = createEventDispatcher()
	function onClose() {
		dispatch('close')
	}
</script>

<div
	in:fly|fade={{ y: -50, duration: 300 }}
	out:fly|fade={{ y: -50, duration: 150 }}
	class="wrapper {type}"
>
	<span class="type-icon icon-layout {type}"> Icon </span>
	<div class="content">
		{#if title}
			<span>
				{title}
			</span>
		{/if}
		<span>
			{description}
		</span>
	</div>
	<form>
		<button type="submit" on:click={onClose}>
			<Cross />
		</button>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		position: absolute;
		border: 2px solid var(--content-background);
		border-radius: var(--border-radius);
		background: var(--palette-base);
		top: 25px;
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
	}

	.content {
		padding: var(--space-3xs) var(--space-2xs);
		display: flex;
		flex-direction: column;
	}

	.icon-layout {
		display: grid;
		place-items: center;
		align-self: stretch;
		padding: var(--space-3xs) var(--space-2xs);
		background: var(--content-background);
		color: var(--content-color);
	}

	button {
		display: flex;
		align-items: center;
		margin: 0 var(--space-2xs);
		border: none;
		border-radius: 0 var(--border-radius) var(--border-radius) 0;
		background: none;
		cursor: pointer;
	}

	.error {
		--content-background: tomato;
		--content-color: white;
	}

	.success {
		--content-background: var(--palette-pop-secondary);
		--content-color: white;
	}

	.message {
		--content-background: var(--palette-secondary-light);
		--content-color: inherit;
	}
</style>
