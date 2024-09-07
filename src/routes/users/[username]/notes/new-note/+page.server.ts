import { type Actions } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/schemas'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const newNoteForm = await superValidate(zod(NoteEditorSchema))
	return { newNoteForm }
}) satisfies PageServerLoad

export const actions = { newOrUpdate } satisfies Actions
