import { render, screen } from '@testing-library/svelte'
import Input from './Input.svelte'
// import { expect, test } from 'vitest' // TODO: WHYYYYYYYYYYYYYYYYYYYYYY

export const inputLabelTestId = 'input-label'

// test('If label passed, label renders', () => {
// 	render(Input, { label: 'Test Label', name: 'test-name' })
// 	screen.debug()
// 	const input = screen.getByTestId(inputLabelTestId)
// 	expect(input).toBeInTheDocument()
// })

// test('If label not passed, label does not render', () => {
// 	render(Input, { name: 'test-name' })
// 	screen.debug()
// 	const input = screen.queryByTestId(inputLabelTestId)
// 	expect(input).not.toBeInTheDocument()
// })
