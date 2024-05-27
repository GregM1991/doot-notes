<script lang="ts">
	import { Button } from '$lib/components'
</script>

<div class="wrapper">
	<h1>Disable Your Two Factor Authentication</h1>
	<p>
		It's not recommended you disable two factor authentication, but if you
		really want to please click here:
	</p>
	<form method="POST">
		<Button danger secondary type="submit">Disable</Button>
	</form>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-s);
		text-align: center;
		max-width: 1080px;
		margin: auto;
	}
</style>
