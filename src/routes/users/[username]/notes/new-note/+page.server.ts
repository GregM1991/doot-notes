import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { NoteEditorSchema } from '$lib/components/EditNote/types'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	const newNoteForm = await superValidate(zod(NoteEditorSchema))
	return { newNoteForm }
}) satisfies PageServerLoad

export const actions = { newOrUpdate } satisfies Actions
