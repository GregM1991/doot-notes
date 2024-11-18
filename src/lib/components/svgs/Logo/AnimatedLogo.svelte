<script lang="ts">
	import { Logo } from '..'
	import {
		animateLogo,
		createTimeline,
		getDurations,
		getMarkers,
		initializeGSAP,
	} from './helpers.logo'

	let logo: SVGElement | null = $state(null)

	$effect(() => {
		initializeGSAP()
		const markers = getMarkers()
		const durations = getDurations(markers)
		const tl = createTimeline(markers)

		animateLogo(tl, durations)
	})
</script>

<Logo {logo}></Logo>
