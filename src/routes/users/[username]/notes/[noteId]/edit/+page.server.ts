import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/schemas'
import { initialiseImageList } from '$lib/utils/misc'

export const load = async ({ parent }) => {
	const { note } = await parent()
	const { images } = note
	const imageList = initialiseImageList(images)
	const formattedNote = {
		...note,
		content: note.content.join('\n'),
	}
	const editNoteForm = await superValidate(formattedNote, zod(NoteEditorSchema))
	return { editNoteForm, images: imageList }
}

export const actions = { newOrUpdate } satisfies Actions
