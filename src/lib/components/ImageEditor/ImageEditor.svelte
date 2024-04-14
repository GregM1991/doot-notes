<script lang="ts">
	import { Input } from '$lib/components'
	import Cross from 'virtual:icons/radix-icons/cross2'

	export let index: number
</script>

<fieldset class="container">
	<button class="remove-image-button" name="intent" value="remove-image">
		<span aria-hidden>
			<!-- Cross Icon goes here -->
			<Cross />
		</span>
		<span class="sr-only">Remove image {index}</span>
	</button>
	<div class="button-container">
		<span>Images</span>
		<label>
			<div>
				<!-- Plus Icon goes here -->
			</div>
			<input name="image-{index}-file" type="file" />
		</label>
	</div>
	<label for="image-{index}-alt"> Alt Text </label>
	<Input textArea name="image-{index}-alt" />
</fieldset>

<style>
	fieldset {
		border: none;
		position: relative;
	}
	.container {
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

	.button-container {
	}
</style>
