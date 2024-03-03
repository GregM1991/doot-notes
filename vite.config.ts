import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const MODE = process.env.NODE_ENV;

export default defineConfig({
	build: {
		cssMinify: MODE === 'production',
		rollupOptions: {
			external: [/node:.*/, 'stream', 'crypto', 'fsevents']
		}
	},
	plugins: [sveltekit()]
});
