<script lang="ts">
	import classnames from 'classnames'

	let {
		toggleActive,
		isActive,
		controlledBy,
	}: { toggleActive: () => void; isActive: boolean; controlledBy: string } =
		$props()

	const classes = $derived(
		classnames({
			active: isActive === true,
		}),
	)
</script>

<button
	class="hamburger"
	aria-expanded={`${isActive}`}
	aria-controls={controlledBy}
	onclick={toggleActive}
	aria-label="hamburger-toggle"
>
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
		top: 30px;
		right: 30px;
		z-index: 2;

		.line {
			display: block;
			border-radius: 4px;
			width: 25px;
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
