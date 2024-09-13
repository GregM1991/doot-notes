<script lang="ts">
	import { fly } from 'svelte/transition'
	import { Cross } from '$lib/components'
	import type { Toast } from '$lib/server/sessions/toastSession'

	let { toast }: { toast: Omit<Toast, 'id'> | null } = $props()
	let showToast = $state(false)

	$effect(() => {
		if (toast) {
			showToast = true

			const timer = setTimeout(() => {
				showToast = false
			}, 5000)

			return () => clearTimeout(timer)
		}
	})
</script>

{#if showToast && toast}
	<div
		in:fly|fade={{ y: -50, duration: 300 }}
		out:fly|fade={{ y: -50, duration: 150 }}
		class="wrapper {toast.type}"
	>
		<span class="type-icon icon-layout {toast.type}"> Icon </span>
		<div class="content">
			{#if toast.title}
				<span>
					{toast.title}
				</span>
			{/if}
			<span>
				{toast.description}
			</span>
		</div>
		<form>
			<button type="submit" onclick={() => showToast = false}>
				<Cross />
			</button>
		</form>
	</div>
{/if}

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
		z-index: 3;
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
