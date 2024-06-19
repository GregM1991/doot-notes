import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [sveltekit(), svelteTesting(), Icons({ compiler: 'svelte' })],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.js'],
	},
})
