export function createPrefersReducedMotionStore() {
	let reducedMotion = $state(false)

	if (typeof window === 'undefined') return

	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
	reducedMotion = mediaQuery.matches

	return reducedMotion
}
