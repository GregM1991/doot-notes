import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { type Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import type { PageServerLoad } from './$types'
import { NoteEditorSchema } from '$lib/schemas'
import { initialiseImageList } from '$lib/utils/misc'

export const load = (async () => {
	const newNoteForm = await superValidate(zod(NoteEditorSchema))
	const images = initialiseImageList(null)
	return { newNoteForm, images }
}) satisfies PageServerLoad

export const actions = { newOrUpdate } satisfies Actions
