<script lang="ts">
	import type { PageData } from "./$types"

  
  export let data: PageData
</script>

<main>
  <h2>{data.note.title}</h2>
  <p>{data.note.body}</p>
</main>

<style>
  main {
    padding: var(--space-m) var(--space-xl);
    background: var(--palette-base-light);
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
    border: 4px solid var(--palette-base-medium);
    border-left: none;
  }

  h2 {
    color: var(--palette-pop);
    font-size: var(--type-step-3);
    margin-bottom: var(--space-3xs);
    line-height: 2.2rem;
    margin-bottom: var(--space-xs);
  }
</style>