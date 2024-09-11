<script lang="ts">
	type CornerProps = {
		fill?: string
		width?: string
		height?: string
		class?: string
	}

	let {
		fill = 'currentColor',
		width = '1em',
		height = '1em',
		class: className = '',
	}: CornerProps = $props()
</script>

<svg
	id="elecRVqvIgF1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 300 300"
	shape-rendering="geometricPrecision"
	text-rendering="geometricPrecision"
	{width}
	{height}
	{fill}
	class={className}
	><path
		d="M-0.001586,0.001736q.003463,299.998265,300.003168,299.994793.000008.000019-299.999703.003472L-0.001586,0.001736Z"
		transform="matrix(1.000001 0.000012-.000012 1 0.001586-.001736)"
		stroke-width="0.6"
	/></svg
>
