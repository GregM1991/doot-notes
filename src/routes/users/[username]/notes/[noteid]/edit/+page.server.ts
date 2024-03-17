// import type { PageServerLoad, Actions } from './$types'
// import { fail, redirect } from '@sveltejs/kit'
// import { prisma } from '$lib/utils/db.server'
// import { invariantResponse } from '$lib/utils/misc'
// import {
// 	NoteEditorSchema,
// 	type FlattenedNoteFormErrors,
// } from '$lib/components/EditNote/types'

// export const load = (async ({ parent }) => {
// 	const note = await parent()
// 	return { note }
// }) satisfies PageServerLoad

// export const actions = {
// 	default: async ({ request, params }) => {
//     const formData = await request.formData()
//     const submission = NoteEditorSchema.safeParse(formData)

//     if (!submission.success) {
//       const errorData = submission.error()
//     }

// 	},
// } satisfies Actions
