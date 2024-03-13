<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
  let paragraphs = data.note.body.split('\n');
</script>

<article>
  <h2>{data.note.title}</h2>
  <!-- TODO: Add note images here -->
  
  {#each paragraphs as paragraph}
    <p>{paragraph}</p>
  {/each}
</article>

<style>
  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

	h2 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
		margin-bottom: var(--space-xs);
	}
</style>
