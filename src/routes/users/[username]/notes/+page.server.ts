import { type Actions } from '@sveltejs/kit'
import { newOrUpdate } from '$lib/components/EditNote/newOrUpdate.server'

export const actions = { newOrUpdate } satisfies Actions
