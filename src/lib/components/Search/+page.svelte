<script lang='ts'>
  export let autofocus = false
  let form: HTMLFormElement

</script>

<form bind:this={form} on:submit|preventDefault={searchUsers}>
  <label class="sr-only" for="search">Search</label>
  <!-- svelte-ignore a11y-autofocus -->
  <input
    placeholder="Search"
    name="search"
    type="search"
    on:input={searchUsers}
    autofocus
    value={data.searchQuery ?? ''}
  />
  <button>Search</button>
</form>