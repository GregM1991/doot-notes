import { render, screen } from '@testing-library/svelte/svelte5'
import { describe, expect, test } from 'vitest'
import { inputLabelTestId, validationTest } from '../formElements.consts'
import TextArea from './TextArea.svelte'

describe('TextArea', () => {
	test('If label passed, label renders', () => {
		render(TextArea, { label: 'Test Label', name: 'test-name' })
		const input = screen.getByTestId(inputLabelTestId)
		expect(input).toBeInTheDocument()
	})

	test('If label not passed, label does not render', () => {
		render(TextArea, { name: 'test-name' })
		const input = screen.queryByTestId(inputLabelTestId)
		expect(input).not.toBeInTheDocument()
	})

	test('If the hidden is true, input does not render', () => {
		render(TextArea, { name: 'test-name', hidden: true })
		const input = screen.queryByTestId(inputLabelTestId)
		expect(input).not.toBeInTheDocument()
	})

	test('If the hidden is true, validation div does not render', () => {
		render(TextArea, { name: 'test-name', hidden: true })
		const validationBox = screen.queryByTestId(validationTest)
		expect(validationBox).not.toBeInTheDocument()
	})

	test('When there are errors, validation div renders', () => {
		render(TextArea, {
			name: 'test-name',
			errors: ['Error 1', 'Error 2'],
		})
		const validationBox = screen.getByTestId(validationTest)
		expect(validationBox).toBeInTheDocument()
	})

	test('Aria-invalid is set when there are errors', () => {
		render(TextArea, {
			name: 'test-name',
			errors: ['Error 1', 'Error 2'],
		})
		const input = screen.getByRole('textbox')
		expect(input).toHaveAttribute('aria-invalid', 'true')
	})

	test('Aria-invalid is not set when there are no errors', () => {
		render(TextArea, { name: 'test-name' })
		const input = screen.getByRole('textbox')
		expect(input).not.toHaveAttribute('aria-invalid')
	})
})
