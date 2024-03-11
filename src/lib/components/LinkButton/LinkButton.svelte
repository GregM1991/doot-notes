<script lang="ts">
  export let href: string;
</script>

<a {href}>
  <slot />
</a>

<style>
  a {
    padding: var(--space-xs);
    background: var(--palette-secondary);
    border-radius: var(--border-radius);
    border: var(--border);
    filter: var(--border-drop-shadow-black);
  }
</style>