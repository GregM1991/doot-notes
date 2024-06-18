import { render, screen, within } from '@testing-library/svelte'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import EditNote from './EditNote.svelte'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { NoteEditorSchema } from '$lib/schemas'
import { idTestId, imageListTestId } from './consts.editNote'

const action = `/test/action`

test('If no form data is passed, it shows new note content', async () => {
	const emptyNoteEditorValidatedForm = await superValidate(
		zod(NoteEditorSchema),
	)
	const action = `/test/action`

	render(EditNote, { data: emptyNoteEditorValidatedForm, action })
	const heading = screen.getByRole('heading')
	const actionButton = screen.getByRole('button', { name: /create note/i })
	const imageList = screen.getByTestId(imageListTestId)
	const id = screen.queryByTestId(idTestId)
	const { getAllByRole } = within(imageList)
	const items = getAllByRole('listitem')

	expect(heading).toBeInTheDocument()
	expect(heading).toHaveTextContent('Doot a new note 📯')
	expect(actionButton).toBeInTheDocument()
	expect(imageList).toBeInTheDocument()
	expect(id).not.toBeInTheDocument()
	expect(items).toHaveLength(1)
})

test('If form data is passed, it shows edit note content', async () => {
	const testNote = {
		content: 'Test Content',
		id: 'test-id',
		title: 'Test Title',
	}
	const savedNoteEditorValidatedForm = await superValidate(
		testNote,
		zod(NoteEditorSchema),
	)

	render(EditNote, { data: savedNoteEditorValidatedForm, action })
	const heading = screen.getByRole('heading')
	const actionButton = screen.getByRole('button', { name: /save changes/i })
	const imageList = screen.getByTestId(imageListTestId)
	const id = screen.queryByTestId(idTestId)
	const { getAllByRole } = within(imageList)
	const items = getAllByRole('listitem')

	expect(heading).toBeInTheDocument()
	expect(heading).toHaveTextContent(testNote.title)
	expect(actionButton).toBeInTheDocument()
	expect(imageList).toBeInTheDocument()
	expect(id).toBeInTheDocument()
	expect(id).toHaveValue(testNote.id)
	expect(items).toHaveLength(1)
})
