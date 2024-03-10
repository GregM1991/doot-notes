<script lang="ts">
	export let data
	$: ({ id, name, username, image } = data.user)
	$: ({ userJoinedDisplay } = data)
</script>

<h1>{name}'s Notes</h1>
<main>
  {userJoinedDisplay}
</main>
