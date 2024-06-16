import { render, screen } from '@testing-library/svelte'
import userEvent from '@testing-library/svelteuser-event'
import { expect, test } from 'vitest'
import { AvatarMenu } from '$lib/components'

test('no initial greeting', () => {
	render(AvatarMenu)

	const button = screen.getByRole('button', { name: 'Greet' })
	const greeting = screen.queryByText(/hello/iu)

	expect(button).toBeInTheDocument()
	expect(greeting).not.toBeInTheDocument()
})

test('greeting appears on click', async () => {
	const user = userEvent.setup()
	render(AvatarMenu)

	const button = screen.getByRole('button')
	await user.click(button)
	const greeting = screen.getByText(/hello world/iu)

	expect(greeting).toBeInTheDocument()
})
