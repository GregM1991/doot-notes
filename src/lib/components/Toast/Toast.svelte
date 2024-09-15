<script lang="ts">
	import { fly } from 'svelte/transition'
	import { Check, CircleBackslash, Cross, InfoCircled } from '$lib/components'
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
		<span class="icon-layout {toast.type}">
			{#if toast.type === 'success'}
				<Check />
			{:else if toast.type === 'error'}
				<CircleBackslash />
			{:else if toast.type === 'message'}
				<InfoCircled />
			{/if}
		</span>
		<div class="content">
			{#if toast.title}
				<strong>
					{toast.title}
				</strong>
			{/if}
			<span>
				{toast.description}
			</span>
		</div>
		<form class="dismiss-toast">
			<button type="submit" onclick={() => (showToast = false)}>
				<Cross />
			</button>
		</form>
	</div>
{/if}

<style>
	.wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2xs);
		position: absolute;
		border: 2px solid var(--content-background);
		filter: drop-shadow(var(--border-drop-shadow) var(--content-background));
		border-radius: var(--border-radius);
		background: var(--palette-base);
		top: 25px;
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
		z-index: 3;
		padding: var(--space-2xs);
		font-size: 1rem;

		@media (--below-med) {
			top: var(--space-m);
			left: var(--space-m);
			right: var(--space-m);
			transform: none;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
	}

	.icon-layout {
		display: grid;
		place-items: center;
		color: var(--content-color);
		background: var(--content-background);
		border-radius: var(--border-radius-small);
		width: 40px;
		height: 40px;
		font-size: 1.3rem;
	}

	.dismiss-toast {
		width: max-content;
		margin-left: var(--space-s);
		font-size: 1.3rem;

		@media (--below-med) {
			margin-left: auto;
		}
	}

	button {
		display: flex;
		align-items: center;
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
