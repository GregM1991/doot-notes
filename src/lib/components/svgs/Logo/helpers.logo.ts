import gsap from 'gsap'
import { CustomEase } from 'gsap/dist/CustomEase'
import confetti from 'canvas-confetti'

const CONFIG = {
	animation: {
		fullBounceTime: 1.5,
		honkTime: 0.6,
		fullXOffset: 200,
	},
	ratios: {
		peak1: 0.4, // 40% of fullBounceTime
		groundBounce: 0.6, // 60% of fullBounceTime
		peak2: 0.8, // 80% of fullBounceTime
		honkOffset: 0.2,
	},
	customEase: {
		name: 'bouncy',
		path: 'M0,0 C0.045,0.401 0.178,1.412 0.373,1.412 0.514,1.412 0.568,1.19 0.599,1.014 0.634,1.191 0.711,1.217 0.804,1.217 0.95,1.217 1,1 1,1',
	},
} as const

export const getMarkers = () => ({
	start: 0,
	peak1: CONFIG.ratios.peak1 * CONFIG.animation.fullBounceTime,
	groundBounce: CONFIG.ratios.groundBounce * CONFIG.animation.fullBounceTime,
	peak2: CONFIG.ratios.peak2 * CONFIG.animation.fullBounceTime,
	honk1: CONFIG.animation.fullBounceTime,
	honk2:
		CONFIG.animation.fullBounceTime +
		CONFIG.animation.honkTime -
		CONFIG.ratios.honkOffset,
})

export const getDurations = (markers: ReturnType<typeof getMarkers>) => ({
	initUp: markers.peak1,
	initDown: markers.groundBounce - markers.peak1,
	secondUp: markers.peak2 - markers.groundBounce,
	secondDown: CONFIG.animation.fullBounceTime - markers.peak2,
})

export function createTimeline(markers: ReturnType<typeof getMarkers>) {
	const tl = gsap.timeline()

	Object.entries(markers).forEach(([key, value]) => {
		tl.addLabel(key, value)
	})

	return tl
}

export function initializeGSAP() {
	gsap.registerPlugin(CustomEase)
	CustomEase.create(CONFIG.customEase.name, CONFIG.customEase.path)

	gsap.set('#logo', {
		y: 140,
		rotate: 35,
		opacity: 0,
	})
}

export function animateLogo(
	tl: gsap.core.Timeline,
	durations: ReturnType<typeof getDurations>,
) {
	tl.to('#logo', {
		y: 0,
		duration: CONFIG.animation.fullBounceTime,
		ease: CONFIG.customEase.name,
	})
		.to(
			'#logo',
			{
				duration: durations.initUp,
				rotate: 0,
				opacity: 1,
				x: CONFIG.animation.fullXOffset * CONFIG.ratios.peak1,
				ease: 'none',
			},
			'start',
		)
		.to(
			'#logo',
			{
				duration: durations.initDown,
				rotate: -20,
				x: CONFIG.animation.fullXOffset * CONFIG.ratios.groundBounce,
				ease: 'none',
			},
			'peak1',
		)
		.to(
			'#logo',
			{
				duration: durations.secondUp,
				rotate: 15,
				x: CONFIG.animation.fullXOffset * CONFIG.ratios.peak2,
				ease: 'none',
			},
			'groundBounce',
		)
		.to(
			'#logo',
			{
				duration: durations.secondDown,
				rotate: -10,
				x: CONFIG.animation.fullXOffset,
				ease: 'none',
			},
			'peak2',
		)
		.to('#logo', {
			duration: CONFIG.animation.honkTime,
			x: 100,
			y: 50,
			rotate: 15,
			ease: 'expo.out',
		})
		.to(
			'#logo',
			{
				duration: CONFIG.animation.honkTime,
				x: 0,
				y: 0,
				rotate: -15,
				ease: 'expo.out',
			},
			`honk2`,
		)

	tl.call(() => fireConfettiFromLogo(15), [], 'honk1').call(
		() => fireConfettiFromLogo(-15),
		[],
		'honk2',
	)
}

function fireConfettiFromLogo(angle: number) {
	const logo = document.getElementById('logo')
	if (!logo) return

	const rect = logo.getBoundingClientRect()
	const x = (rect.left + rect.width / 1.5) / window.innerWidth
	const y = (rect.top + rect.height / 1.5) / window.innerHeight

	confetti({
		particleCount: 50,
		spread: 60,
		origin: { x, y },
		angle,
		startVelocity: 60,
		decay: 0.8,
		gravity: 0.5,
		drift: 0.5,
		colors: [
			'#E64C23',
			'#FCDDD6',
			'#FF9AA3',
			'#CC1F2D',
			'#FFB3BA',
			'#FFBB33',
			'#FFF0CC',
			'#0066A3',
			'#66B2E6',
			'#E6F3FF',
			'#538C40',
			'#F9F6F3',
			'#DED5CC',
			'#FCFBFA',
		],
		disableForReducedMotion: true,
	})
}
