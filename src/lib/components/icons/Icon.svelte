<script lang='ts'>
	import type { IconName } from './name.d.ts'

	export let name: IconName

</script>

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
