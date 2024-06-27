import { render, screen } from '@testing-library/svelte/svelte5'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import AvatarMenu from './AvatarMenu.svelte'

let name: string
let username: string

beforeEach(() => {
	name = 'Test Name'
	username = 'test-username'
})

test('Img shows default image without userImageId given', () => {
	render(AvatarMenu, { username, name })

	const button = screen.getByRole('link', { name: `${name} ${name}` })

	expect(button).toBeInTheDocument()
})

test('Menu shows when clicked', async () => {
	const user = userEvent.setup()
	render(AvatarMenu, { username, name })

	const button = screen.getByRole('link', { name: `${name} ${name}` })

	expect(button).toBeInTheDocument()
	await user.click(button)
	const menu = screen.getByRole('menu', { name: `${name} ${name}` })
	expect(menu).toBeInTheDocument()
})

test('Profile link takes you to the correct profile', async () => {
	const user = userEvent.setup()
	render(AvatarMenu, { username, name })

	const button = screen.getByRole('link', { name: `${name} ${name}` })

	expect(button).toBeInTheDocument()
	await user.click(button)
	const profileLink = screen.getByRole('menuitem', { name: 'Profile' })
	expect(profileLink).toHaveAttribute('href', `/users/${username}`)
})

test('Notes link takes you to the correct notes page', async () => {
	const user = userEvent.setup()
	render(AvatarMenu, { username, name })

	const button = screen.getByRole('link', { name: `${name} ${name}` })
	expect(button).toBeInTheDocument()

	await user.click(button)
	const notesLink = screen.getByRole('menuitem', { name: 'Notes' })
	expect(notesLink).toHaveAttribute('href', `/users/${username}/notes`)
})

test('Logout button triggers the logout action', async () => {
	const user = userEvent.setup()
	render(AvatarMenu, { username, name })

	const button = screen.getByRole('link', { name: `${name} ${name}` })
	expect(button).toBeInTheDocument()

	await user.click(button)
	const logoutButton = screen.getByText('Logout')
	expect(logoutButton).toBeInTheDocument()
})
