<script lang="ts">
	import { LinkButton } from '$lib/components'

	export let data
	$: ({ name, username, image } = data.user) // TODO: add user image
	$: ({ userJoinedDisplay } = data)
</script>

<h1>{name}'s Profile</h1>
<main>
  <div>
    <span>Username: {username}</span>
    <span class="date-joined">joined {userJoinedDisplay}</span>
  </div>
	<LinkButton href={`${username}/notes`}>View {name}'s notes</LinkButton>
</main>

<style>
	h1 { 
		color: var(--palette-pop);
		font-size: var(--type-step-3);
		margin-bottom: var(--space-3xs);
	}

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-s)
  }

  div {
    display: flex;
    flex-direction: column;
  }

  .date-joined {
    font-size: var(--type-step--1);
  }
</style>
