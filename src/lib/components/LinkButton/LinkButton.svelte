<script lang="ts">
	export let href: string
	export let customStyles: Record<string, string> | undefined = undefined
	export let primary: boolean = true
	export let secondary: boolean = false
	export let fluid = false

  function styleSpreader(style: Record<string, string>) {
    console.log(style)
    return undefined
  }
  const style = customStyles ? styleSpreader(customStyles) : undefined
</script>


<!-- TODO: Figure out how to pass in width here -->
<a {href} class:primary class:fluid class:secondary {style}>
	<slot />
</a>

<style>
	a {
		padding: var(--space-xs);
		background: var(--link-background);
		border-radius: var(--border-radius);
		border: var(--border);
		filter: var(--border-drop-shadow-black);
		display: inline-block;
		width: auto;

		transition: var(--animation-quick);
	}
	D a:hover {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

	a:focus {
		filter: drop-shadow(5px 5px 0px var(--palette-grey-20));
	}

	.primary {
		--link-background: var(--palette-secondary);
	}

	.secondary {
		--link-background: var(--palette-);
	}

	.fluid {
		--link-width: 100%;
	}
</style>
