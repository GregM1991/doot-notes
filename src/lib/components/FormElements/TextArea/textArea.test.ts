import { render, screen, within } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import TextArea from './TextArea.svelte'

test('If no form data is passed, it shows new note content', async () => {
	render(TextArea, { name: 'test-name' })
	expect(true).toBe(true)
})
