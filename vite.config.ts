import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vitest/config'

const MODE = process.env.NODE_ENV

export default defineConfig({
	build: {
		cssMinify: MODE === 'production',
		rollupOptions: {
			external: [/node:.*/, 'stream', 'crypto', 'fsevents'],
		},
	},
	plugins: [
		svelteTesting(),
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
	],
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
	},
	css: {
		devSourcemap: MODE === 'development',
	},
})
