<script lang="ts">
	import gsap from 'gsap'

	let startHorn: SVGPathElement
	let bulb: SVGPathElement
	let endHorn: SVGPathElement

	$effect(() => {
		for (const svgElement of [startHorn, bulb, endHorn]) {
			if (!svgElement) {
				throw new Error('SVG element not found')
			}
			const pathLength = svgElement.getTotalLength()
			svgElement.style.strokeDasharray = `${pathLength}`
			svgElement.style.strokeDashoffset = `${pathLength}`
		}

		const tl = gsap.timeline()

		tl.to('.bulb', {
				strokeDashoffset: 0,
			})
			.to('.start-horn', {
				strokeDashoffset: 0,
			})
			.to('.end-horn', {
				strokeDashoffset: 0,
			})
	})
</script>

<svg
	class="logo"
	id="enzdiJ8j1sR1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 150 600 250"
	shape-rendering="geometricPrecision"
	text-rendering="geometricPrecision"
	height="200"
>
	<g clip-path="url(#enzdiJ8j1sR9)">
		<path
			bind:this={startHorn}
			class="start-horn path"
			d="M170.065943,246.251722q87.961876,0,124.10621,0c36.144334,0,82.20437,13.114317,82.20437,69.409917s-44.78059,69.409915-98.837161,69.409915-92.120074-19.191683-92.120074-65.251719q-1.279445-34.545027,42.986525-68.665034"
			transform="translate(0 0.000001)"
			fill="none"
			stroke="#ffc926"
			stroke-width="28"
		/>
		<clipPath id="enzdiJ8j1sR9">
			<path
				d="M280.03737,234.490059h-106.993521v23.126204q72.722159,0,105.321748,0c54.308308,0,87.401662,15.282907,87.401662,55.052874s-20.635362,61.906082-84.417385,61.906082-85.918138-25.51281-85.918138-57.403822s28.044274-53.71869,34.942724-53.71869c.258815.25882-31.9657-.013081-31.9657-.271896s-24.982526,14.811867-25.266285,53.519252c0,45.341224,23.691811,79.245022,107.430108,79.245022s107.430108-35.537715,107.430108-82.512858-38.397072-78.836544-100.894436-78.836544q-.551116,0-7.070885-.105624Z"
				transform="translate(.201944-.802879)"
				fill="#ffc926"
				stroke-width="1.2"
			/>
		</clipPath>
	</g>
	<g clip-path="url(#enzdiJ8j1sR13)">
		<line
			bind:this={bulb}
			class="bulb path"
			x1="-79.460352"
			y1="0"
			x2="79.460352"
			y2="0"
			transform="matrix(1.05303 0 0 1 92.149459 245.775523)"
			fill="none"
			stroke="#000"
			stroke-width="120"
		/>
		<clipPath id="enzdiJ8j1sR13">
			<path
				d="M14.385676,251.091881c0-34.63179,24.350477-60.605632,54.112172-60.605632s41.213423,15.42476,45.243922,20.385375s28.641241,24.17324,46.313431,24.17324c0-2.748023,1.119565-2.748023,7.124504-2.748023s8.345847-.407114,8.345847,3.358695s0,20.410134,0,23.138219-1.656703,2.879645-7.870673,2.879645-7.426452-.303121-7.426452-2.424964c-3.182765,0-26.563461,2.837508-42.972204,20.015411s-25.376003,24.869501-48.200683,24.869501-54.669865-18.409677-54.669864-53.041467Z"
				transform="translate(-1.64675-1.118595)"
				fill="url(#enzdiJ8j1sR14-fill)"
				stroke-width="1.2"
			/>
		</clipPath>
	</g>
	<g clip-path="url(#enzdiJ8j1sR5)">
		<path
			bind:this={endHorn}
			class="end-horn path"
			d="M327.425016,245.422111l263.703775-.521153"
			transform="translate(.000001 0)"
			fill="none"
			stroke="#ecb22c"
			stroke-width="193"
		/>
		<clipPath id="enzdiJ8j1sR5">
			<path
				d="M370.39583,257.12146q7.305673.109218,7.593436.342692c51.031864,0,158.374752,31.467328,181.251105,67.834863-4.106012,7.038877-1.736872,12.365422.766391,13.328215s8.087467,2.118146,12.708877-6.546998s15.983437-36.196329,15.983437-80.607587-9.778625-80.673662-17.92748-92.896943c-2.444656-5.296755-8.224603-4.217852-9.829654-3.281572s-6.420205,4.41389-4.012628,9.496553c1.87256,4.280137,2.006314,4.6814,1.738806,4.6814-6.821468,6.553959-62.596308,64.9935-179.86931,64.9935q-30.469358.510156-52.208008.154933c12.990396-.001848,41.734658,17.405391,43.805028,22.500944Z"
				transform="translate(.521158 0.000002)"
				fill="#ecb22c"
				stroke-width="1.2"
			/>
		</clipPath>
	</g>
</svg>
