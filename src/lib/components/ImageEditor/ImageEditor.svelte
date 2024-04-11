<script lang="ts">
	import { Input } from '$lib/components'

	export let index: number
</script>

<div class="container">
	<div class="button-container">
		<span>Images</span>
		<label>
			<div>
				<!-- Plus Icon goes here -->
			</div>
			<input name="image-{index}-file" type="file" />
		</label>
		<input id="image-{index}-file" />
	</div>
	<label for="image-{index}-alt"> Alt Text </label>
	<Input textArea name="image-{index}-alt" />
</div>

<style>
	.container {
	}

	.button-container {
	}
</style>
