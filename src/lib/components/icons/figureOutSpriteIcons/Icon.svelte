<script lang="ts">
	import type { IconName } from './name'

	export let name: IconName
</script>

<!-- TODO: Get icons working with sprite -->
{#if $$slots.default}
	<span>
		<svelte:self {name} />
		<slot />
		<!-- This is where the children content will be injected -->
	</span>
{:else}
	<svg>
		<use href={`#${name}`} />
	</svg>
{/if}

<style>
	span {
		display: inline-flex;
		align-items: center;
	}
</style>
