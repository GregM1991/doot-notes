<script lang="ts">
	export let type: 'button' | 'a' = 'button'
	export let href: string;

	if (type === 'a' && !href) {
		throw new Error('anchor tags must have an href')
	}

</script>

<svelte:element {href} this={type}>
	<slot />
</svelte:element>

<style>
</style>
