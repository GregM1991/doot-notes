<script lang="ts">
	import { Input } from '$lib/components'
	import Cross from 'virtual:icons/radix-icons/cross2'

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
	<div class="button-container">
		<label>
			<div>
				<!-- Plus Icon goes here -->
			</div>
			<input name="image-{index}-file" type="file" />
		</label>
	</div>
	<label class='alt-input' for="image-{index}-alt">
		Alt Text
		<Input textArea name="image-{index}-alt" />
	</label>
</fieldset>

<style>
	.container {
		display: flex;
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

	.button-container {
		height: 32px;
		width: 32px;
	}

	.alt-input {
		flex: 5
	}
</style>
