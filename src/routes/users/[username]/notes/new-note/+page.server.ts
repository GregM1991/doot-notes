import { type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import  { type PageServerLoad } from './$types'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/schemas'

export const load = (async () => {
	const newNoteForm = await superValidate(zod(NoteEditorSchema))
	return { newNoteForm }
}) satisfies PageServerLoad

export const actions = { newOrUpdate } satisfies Actions
