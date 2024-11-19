import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import Icons from 'unplugin-icons/vite'
import { svelteTesting } from '@testing-library/svelte/vite'

const MODE = process.env.NODE_ENV

export default defineConfig({
	build: {
		sourcemap: MODE === 'development',
		cssMinify: MODE === 'production',
		rollupOptions: {
			external: [/node:.*/, 'stream', 'crypto', 'fsevents'],
		},
		sourcemap: MODE !== 'production',
	},
	plugins: [
		svelteTesting(),
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
	],
	css: {
		devSourcemap: MODE === 'development',
	},
	server: {
		watch: {
			usePolling: true,
			interval: 100,
		},
		hmr: {
			protocol: 'ws',
		},
	},
})
