<script lang="ts">
	import { enhance } from '$app/forms'
	import Button from '$lib/components/Button/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData
  let paragraphs = data.note.content.split('\n').filter(para =>  para.trim().length > 0)

</script>

<article>
  <h2>{data.note.title}</h2>
  <!-- TODO: Add note images here -->
  
  {#each paragraphs as paragraph}
    <p>{paragraph}</p>
  {/each}
</article>

<!-- TODO: only allow for owner of note -->
<div class="info-bar">
  <span>{data.timeSinceUpdate}</span>
  <div class="buttons">
    <form action="?/edit" method="POST" use:enhance>
      <Button secondary type="submit">Edit</Button>
    </form>
    <form action="?/delete" method="POST" use:enhance>
      <Button type="submit">Delete</Button>
    </form>
  </div>
</div>
<div class="blur"/>

<style>
  article {
    grid-column: 1 / 1;
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    overflow: auto;
  }

	h2 {
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
		line-height: 2.8rem;
		margin-bottom: var(--space-xs);
	}

  .info-bar {
    grid-column: 1 / 2;
    grid-row: 2 / span 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: var(--space-m);
    left: var(--space-xl);
    right: var(--space-xl);
    padding: var(--space-s);
    border-radius: var(--border-radius);
  }
   
  .buttons {
    display: flex;
    gap: var(--space-s);
  }

  .blur {
    grid-column: 1 / 2;
    grid-row: 2 / span 1;
    backdrop-filter: blur(2px);
    border-radius: var(--border-radius);
    background: hsla(var(--palette-cream-80), 10%);
    /* background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3); */
    
  }
</style>
