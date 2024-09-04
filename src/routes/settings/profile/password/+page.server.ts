import { redirect } from '@sveltejs/kit'
import { fail, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import  { type Actions, type PageServerLoad } from './$types'
import { ChangePasswordFormSchema } from '$lib/schemas'
import { setToastDataToCookie } from '$lib/server/sessions/toastSession'
import {
	getPasswordHash,
	requireUserId,
	verifyUserPassword,
} from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { requirePassword } from '$lib/utils/misc.server'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	await requirePassword(userId)
	const editPasswordForm = await superValidate(zod(ChangePasswordFormSchema))
	return { editPasswordForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ locals, request, cookies }) => {
		const userId = requireUserId(locals.userId, request)
		await requirePassword(userId)
		const form = await superValidate(
			request,
			zod(
				ChangePasswordFormSchema.superRefine(
					async ({ currentPassword, newPassword }, ctx) => {
						if (currentPassword && newPassword) {
							const user = await verifyUserPassword(
								{ id: userId },
								currentPassword,
							)
							if (!user) {
								ctx.addIssue({
									path: ['currentPassword'],
									code: z.ZodIssueCode.custom,
									message: 'Incorrect password.',
								})
							}
						}
					},
				),
			),
		)
		if (!form.valid) {
			return fail(400, {
				form: {
					...form,
					data: {
						...form.data,
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: '',
					},
				},
			})
		}
		const { newPassword } = form.data

		await prisma.user.update({
			select: { username: true },
			where: { id: userId },
			data: {
				password: {
					update: {
						hash: await getPasswordHash(newPassword),
					},
				},
			},
		})
		setToastDataToCookie(cookies, {
			title: 'Success',
			description: 'Note successfully deleted',
			type: 'success',
		})
		return redirect(302, '/settings/profile')
	},
} satisfies Actions
