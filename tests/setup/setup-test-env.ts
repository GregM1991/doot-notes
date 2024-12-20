import 'dotenv/config'
import './db-setup.ts'
// we need these to be imported first 👆
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/svelte/svelte5'
import { afterEach, beforeEach, vi, type MockInstance } from 'vitest'
import { server } from '../../tests/mocks'

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())

export let consoleError: MockInstance<typeof console.error>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})
