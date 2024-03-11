<script lang="ts">
  import Button from '../../../lib/components/Button/Button.svelte';

	export let data
	$: ({ id, name, username, image } = data.user)
	$: ({ userJoinedDisplay } = data)
</script>

<h1>{name}'s Profile</h1>
<main>
  joined {userJoinedDisplay}
	<LinkButton>View {name}'s notes</LinkButton>
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
	}
</style>