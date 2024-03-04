<script>
  import '$lib/assets/app.css'
</script>

<svelte:head>
  {#if !import.meta.env.Prod}
    <!-- TODO: Do dev things here if need -->
  {/if}

  <title>Let's take some notes 📓</title>
</svelte:head>

<slot />
