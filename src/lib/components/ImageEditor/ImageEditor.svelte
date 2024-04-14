<script lang="ts">
	import { Input } from '$lib/components'
	import Cross from 'virtual:icons/radix-icons/cross2'
	import Plus from 'virtual:icons/radix-icons/plus'

	export let index: number
</script>

<fieldset class="container">
	<legend class='sr-only'>Select an image to upload</legend>	
	<button class="remove-image-button" name="intent" value="remove-image">
		<span aria-hidden>
			<Cross />
		</span>
		<span class="sr-only">Remove image {index}</span>
	</button>
	<!-- TODO: fix focus for file input -->
	<div class="file-input-container">
		<label class="file-label">
			<div class="plus">
				<Plus />
			</div>
			<input class="file" name="image-{index}-file" type="file" />
		</label>
	</div>
	<div class="alt-input">
		<Input label="Alt text" textArea name="image-{index}-alt" />
	</div>
</fieldset>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: var(--space-m);
		border: none;
		position: relative;
	}

	.remove-image-button {
		display: grid;
		place-items: center;
		position: absolute;
		right: 0;
		top: 0;
		border: none;
		background: none;
		color: tomato;
		cursor: pointer;
	}

	.remove-image-button span {
		display: flex;
	}

	.file-input-container {
		height: var(--space-3xl);
		width: var(--space-3xl);
		background: var(--palette-base);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
	}

	.file-input-container:focus-visible {
		filter: var(--border-drop-shadow-black-focus)
	}

	.file-label {
		cursor: pointer;
	}

	.plus {
		display: grid;
		place-items: center;
		height: 100%;
		font-size: var(--type-step-1);
	}

	.file {
		opacity: 0;
		cursor: pointer;
		height:	var(--space-3xl);
		width: var(--space-3xl);
	}

	.alt-input {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
