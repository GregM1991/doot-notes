<script lang="ts">
	import type { Type } from "$lib/server/sessions/toast"
  import Cross from 'virtual:icons/radix-icons/cross1'

  export let title: string;
  export let description: string;
  export let type: Type
  console.log(type)
</script>

<div class="wrapper">
  <span class="type-icon icon-layout {type}">
    Icon
  </span>
  <div class="content">
    <span>
      {title}
    </span>
    <span>
      {description}
    </span>
  </div>
  <span on:click={() => console.log('dismiss me')} class="icon-layout">
    <Cross />
  </span>
</div>

<style>
.wrapper {
  display: flex;
  position: absolute;
  border: var(--border);
  border-radius: var(--border-radius);
  background: var(--palette-base);
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
}

.content {
  padding: var(--space-3xs) var(--space-2xs);
  display: flex;
  flex-direction: column;
}

.icon-layout {
  display: grid;
  place-items: center;
  padding: var(--space-3xs) var(--space-2xs);
}

.type-icon {
  background: var(--content-background);
  color: var(--content-color);
  border-radius: var(--border-radius) 0 0 var(--border-radius);
}

.error {
  --content-background: tomato;
  --content-color: white;
}

.success {
  --content-background: var(--palette-tertiary);
  --content-color: white;
}

.message {
  --content-background: var(--palette-secondary-light);
  --content-color: inherit;
}
</style>