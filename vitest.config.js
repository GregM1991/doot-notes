import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	plugins: [sveltekit(), svelteTesting(), Icons({ compiler: 'svelte' })],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
	},
})
