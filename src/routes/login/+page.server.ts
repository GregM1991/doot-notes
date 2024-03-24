import { redirect, type Actions } from '@sveltejs/kit'
import { prisma } from '$lib/utils/db.server'
import { z } from 'zod'
import type { PageServerLoad } from './$types'

export const load = (async () => {
	console.log('Login load')
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params }) => {
		console.log('login action')

		// throw redirect(303, '/')
	},
} satisfies Actions
