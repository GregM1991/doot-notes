<script lang="ts">
	import { Logo } from '..'
	import {
		animateLogo,
		createTimeline,
		getDurations,
		getMarkers,
		initializeGSAP,
	} from './helpers.logo'
	import { createPrefersReducedMotionStore } from '$lib/stores/prefersReducedMotion.store.svelte'

	const prefersReducedMotion = createPrefersReducedMotionStore()

	let logo: SVGElement | null = $state(null)

	$effect(() => {
		if (prefersReducedMotion) return
		initializeGSAP()
		const markers = getMarkers()
		const durations = getDurations(markers)
		const tl = createTimeline(markers)

		animateLogo(tl, durations)
	})
</script>

<Logo
	style={`--opacity: ${prefersReducedMotion ? '1' : '0'}; --will-change: transform, opacity;`}
	{logo}
></Logo>
