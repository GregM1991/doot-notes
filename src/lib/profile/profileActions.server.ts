import { z } from 'zod'
import { fail, setError, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { NameSchema, UsernameSchema } from '$lib/utils/userValidation'
import { prisma } from '$lib/utils/db.server'

export const ProfileFormSchema = z.object({
	name: NameSchema.optional(),
	username: UsernameSchema,
})

export async function profileUpdateAction(userId: string, formData: FormData) {
	const form = await superValidate(formData, zod(ProfileFormSchema))
	if (!form.valid) return fail(400, { form })
	const existingUser = await prisma.user.findUnique({
		where: { username: form.data.username },
		select: { id: true },
	})

	if (existingUser && existingUser.id !== userId) {
		return setError(form, 'username', 'E-mail already exists')
	}

	await prisma.user.update({
		select: { username: true },
		where: { id: userId },
		data: {
			name: form.data.name,
			username: form.data.username,
		},
	})

	return { form }
}
