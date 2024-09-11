<script lang="ts">
	import { Button, Check, NoteInfoBar, Plus } from '$lib/components'
	import type { InfoBarProps } from './types.editNote'

	let {
		formId,
		buttonText,
		submitDelayedReason,
		delayed,
		timeout,
	}: InfoBarProps = $props()

	const Icon = $formId ? Check : Plus
</script>

<!-- TODO: Is there a better way to add `fluid` to the Buttons without needing to duplicate them and display: none them based on screen size? -->
<NoteInfoBar>
	<div class="info-bar-buttons desktop">
		<Button danger type="reset">Reset</Button>
		<!-- TODO: confirmation on note deletion NOT-64 -->
		<Button
			variant="secondary"
			type="submit"
			delayed={$delayed || $timeout}
			delayedReason={submitDelayedReason}
		>
			<Icon />
			{buttonText}
		</Button>
	</div>
	<div class="info-bar-buttons mobile">
		<Button danger type="reset" fluid small>Reset</Button>
		<!-- TODO: confirmation on note deletion NOT-64 -->
		<Button
			fluid
			variant="secondary"
			type="submit"
			delayed={$delayed || $timeout}
			delayedReason={submitDelayedReason}
      small
		>
			<Icon />
			{buttonText}
		</Button>
	</div>
</NoteInfoBar>

<style>
	.info-bar-buttons {
		display: flex;
		gap: var(--space-2xs);
		align-items: center;

		width: 100%;
	}

	.desktop {
		justify-content: flex-end;

		@media (--below-med) {
			display: none;
		}
	}

	.mobile {
		justify-content:stretch;

		@media (--above-med) {
			display: none;
		}
	}
</style>
