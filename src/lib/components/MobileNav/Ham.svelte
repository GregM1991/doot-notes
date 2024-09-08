<script lang="ts">
	import classnames from 'classnames'

	let {
		toggleActive,
		isActive,
	}: { toggleActive: () => void; isActive: boolean } = $props()

	const classes = $derived(
		classnames({
			active: isActive === true,
		}),
	)

	$effect(() => {
		console.log({ isActive, classes })
	})
</script>

<button class="hamburger" onclick={toggleActive}>
	<span class="line top {classes}"></span>
	<span class="line mid {classes}"></span>
	<span class="line bot {classes}"></span>
</button>

<style>
	.hamburger {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
		position: absolute;
		top: 20px;
		right: 20px;
		z-index: 2;

		.line {
			display: block;
			border-radius: 4px;
			width: 30px;
			height: 3px;
			background-color: var(--palette-primary);
			transition: 0.2s;

			&.top.active {
				transform: translateY(7px) rotate(45deg);
			}
			&.mid.active {
				opacity: 0;
			}
			&.bot.active {
				transform: translateY(-7px) rotate(-45deg);
			}
		}
	}
</style>
