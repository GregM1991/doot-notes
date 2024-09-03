import path from 'path'
import { preprocessMeltUI, sequence } from '@melt-ui/pp'
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
	kit: {
		adapter: adapter({}),
		alias: {
			$tests: './tests',
			$routes: './src/routes',
			$msw: path.resolve('./src/msw'),
		},
		csrf: {
			checkOrigin: true,
		},
	},
}

export default config
