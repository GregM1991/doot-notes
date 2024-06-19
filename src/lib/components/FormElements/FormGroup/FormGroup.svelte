<script lang="ts">
	export let flex = '1'
	export let fluid = true
</script>

<div class="form-group" style="--flex: {flex}" class:fluid>
	<slot />
</div>

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		flex: var(--flex);
		width: var(--width);
	}

	.fluid {
		--width: 100%;
		justify-content: center;
	}
</style>
