import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { invariantResponse } from '$lib/utils/misc'
import { superValidate } from 'sveltekit-superforms'
import type { PageServerLoad } from './$types'
import { z } from 'zod'
import { NameSchema, UsernameSchema } from '$lib/utils/userValidation'
import { zod } from 'sveltekit-superforms/adapters'

const ProfileFormSchema = z.object({
	name: NameSchema.optional(),
	username: UsernameSchema,
})

export const load = (async ({ request, locals, parent }) => {
	const userId = requireUserId(locals.userId, request)
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { username: true },
	})
	invariantResponse(user, 'User not found', 404)
	// const {user} = await parent()
	const editProfileForm = await superValidate(user, zod(ProfileFormSchema))
	return { editProfileForm }
}) satisfies PageServerLoad
