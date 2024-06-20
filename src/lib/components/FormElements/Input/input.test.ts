import { render, screen } from '@testing-library/svelte'
import Input from './Input.svelte'
import { describe, expect, test } from 'vitest'
import { inputLabelTestId, validationTest } from './consts.input'

describe('Input', () => {
	test('If label passed, label renders', () => {
		render(Input, { label: 'Test Label', name: 'test-name' })
		const input = screen.getByTestId(inputLabelTestId)
		expect(input).toBeInTheDocument()
	})

	test('If label not passed, label does not render', () => {
		render(Input, { name: 'test-name' })
		const input = screen.queryByTestId(inputLabelTestId)
		expect(input).not.toBeInTheDocument()
	})

	test('If the type is "hidden", validation div does not render', () => {
		render(Input, { name: 'test-name', type: 'hidden' })
		const validationBox = screen.queryByTestId(validationTest)
		expect(validationBox).not.toBeInTheDocument()
	})

	test('When there are errors, validation div renders', () => {
		render(Input, {
			name: 'test-name',
			errors: ['Error 1', 'Error 2'],
		})
		const validationBox = screen.getByTestId(validationTest)
		expect(validationBox).toBeInTheDocument()
	})
})
