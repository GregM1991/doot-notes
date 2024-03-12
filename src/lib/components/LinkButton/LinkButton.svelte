<script lang="ts">
  export let href: string
  export let width: string = 'auto'
</script>

<!-- TODO: Figure out how to pass in width here -->
<a {href} class:width={`--width=${width}`}>
  <slot />
</a>

<style>
  a {
    padding: var(--space-xs);
    background: var(--palette-secondary);
    border-radius: var(--border-radius);
    border: var(--border);
    filter: var(--border-drop-shadow-black);
    display: inline-block;
    width: var(--width);

    transition: var(--animation-quick);
  }

  a:hover {
    filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
  }

	a:focus {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

</style>