import { createRawSnippet } from 'svelte'
import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte/svelte5'
import userEvent from '@testing-library/user-event'
import Button from './Button.svelte'

const buttonSnippet = createRawSnippet(() => ({ render: () => 'Test Button' }))

test('button with event', async () => {
	const user = userEvent.setup()
	const onclick = vi.fn()

	// const { component } = render(Button)
	const button = screen.getByRole('button')
	await user.click(button)

	expect(onclick).toHaveBeenCalledOnce()
})

test('If href is present, it should render an anchor tag', () => {
	render(Button, { href: '/login', children: buttonSnippet })
	const button = screen.getByRole('link')
	expect(button).toHaveAttribute('href', '/login')
})
