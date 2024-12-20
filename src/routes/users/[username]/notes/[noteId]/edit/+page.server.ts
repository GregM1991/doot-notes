import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/schemas'

export const load = async ({ parent }) => {
	const { note } = await parent()
	const { images, video } = note

	const formattedNote = {
		...note,
		content: note.content.join('\n'),
	}
	const editNoteForm = await superValidate(formattedNote, zod(NoteEditorSchema))
	return { editNoteForm, images, video }
}

export const actions = { newOrUpdate } satisfies Actions
