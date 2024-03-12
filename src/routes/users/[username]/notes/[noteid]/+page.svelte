<script lang="ts">
	import type { PageData } from "./$types"

  
  export let data: PageData
</script>

<main>
  <h2>{data.note.title}</h2>
  <p>{data.note.body}</p>
</main>

<style>
  h2 {
    color: var(--palette-pop);
    font-size: var(--type-step-2);
    margin-bottom: var(--space-3xs);
    line-height: 2.2rem;
    margin-bottom: var(--space-xs);
  }
</style>