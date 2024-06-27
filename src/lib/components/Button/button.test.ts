import { render, screen } from '@testing-library/svelte/svelte5'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Button from './Button.svelte'

test('button with event', async () => {
	const user = userEvent.setup()
	const onClick = vi.fn()

	const { component } = render(Button)
	component.$on('click', onClick)

	const button = screen.getByRole('button')
	await user.click(button)

	expect(onClick).toHaveBeenCalledOnce()
})

test('If href is present, it should render an anchor tag', () => {
	render(Button, { href: '/login' })
	const button = screen.getByRole('link')
	expect(button).toHaveAttribute('href', '/login')
})
