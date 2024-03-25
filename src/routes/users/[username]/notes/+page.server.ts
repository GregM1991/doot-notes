import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'
import { type Actions } from '@sveltejs/kit'

export const actions = { newOrUpdate } satisfies Actions
