import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/components/EditNote/types'
import type { PageServerLoad } from './$types'

export const load = (async ({ parent }) => {
	const { note } = await parent()
	const editNoteForm = await superValidate(note, zod(NoteEditorSchema))
	return { editNoteForm }
}) satisfies PageServerLoad

export const actions = { newOrUpdate } satisfies Actions
