import { render, screen } from '@testing-library/svelte/svelte5'
import Input from './Input.svelte'
import { describe, expect, test } from 'vitest'
import { inputLabelTestId, validationTest } from '../formElements.consts'

describe('Input', () => {
	test('If label passed, label renders', () => {
		render(Input, { label: 'Test Label', name: 'test-name', value: '' })
		const input = screen.getByTestId(inputLabelTestId)
		expect(input).toBeInTheDocument()
	})

	test('If label not passed, label does not render', () => {
		render(Input, { name: 'test-name', value: '' })
		const input = screen.queryByTestId(inputLabelTestId)
		expect(input).not.toBeInTheDocument()
	})

	test('If the type is "hidden", input does not render', () => {
		render(Input, { name: 'test-name', type: 'hidden', value: '' })
		const input = screen.queryByTestId(inputLabelTestId)
		expect(input).not.toBeInTheDocument()
	})

	test('If the type is "hidden", validation div does not render', () => {
		render(Input, { name: 'test-name', type: 'hidden', value: '' })
		const validationBox = screen.queryByTestId(validationTest)
		expect(validationBox).not.toBeInTheDocument()
	})

	test('When there are errors, validation div renders', () => {
		render(Input, {
			name: 'test-name',
			errors: ['Error 1', 'Error 2'],
			value: '',
		})
		const validationBox = screen.getByTestId(validationTest)
		expect(validationBox).toBeInTheDocument()
	})

	test('Aria-invalid is set when there are errors', () => {
		render(Input, {
			name: 'test-name',
			errors: ['Error 1', 'Error 2'],
			value: '',
		})
		const input = screen.getByRole('textbox')
		expect(input).toHaveAttribute('aria-invalid', 'true')
	})

	test('Aria-invalid is not set when there are no errors', () => {
		render(Input, { name: 'test-name', value: '' })
		const input = screen.getByRole('textbox')
		expect(input).not.toHaveAttribute('aria-invalid')
	})
})
