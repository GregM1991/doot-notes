<script lang="ts">
	import { Input } from '$lib/components'

	export let index: number
</script>

<fieldset class="container">
	<button >
		<span aria-hidden>
			<!-- Cross Icon goes here -->
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
	.container {
	}

	.button-container {
	}
</style>
