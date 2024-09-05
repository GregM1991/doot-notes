import { type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/schemas'

export const load = async ({ parent }) => {
	const { note } = await parent()
	const { images } = note
	const formattedNote = {
		...note,
		content: note.content.join('\n'),
	}
	const editNoteForm = await superValidate(formattedNote, zod(NoteEditorSchema))
	return { editNoteForm, images }
}

export const actions = { newOrUpdate } satisfies Actions
