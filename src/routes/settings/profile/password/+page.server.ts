import {
	getPasswordHash,
	requireUserId,
	verifyUserPassword,
} from '$lib/utils/auth.server'
import { z } from 'zod'
import type { Actions, PageServerLoad } from './$types'
import { prisma } from '$lib/utils/db.server'
import { redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { ChangePasswordForm } from '$lib/profile/schemas'
import { requirePassword } from '$lib/utils/misc.server'
import { setToast } from '$lib/utils/misc'

export const load = (async ({ request, locals }) => {
	const userId = requireUserId(locals.userId, request)
	await requirePassword(userId)
	const editPasswordForm = await superValidate(zod(ChangePasswordForm))
	return { editPasswordForm }
}) satisfies PageServerLoad

export const actions = {
	default: async ({ locals, request }) => {
		const userId = requireUserId(locals.userId, request)
		await requirePassword(userId)
		const form = await superValidate(
			request,
			zod(
				ChangePasswordForm.superRefine(
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
			return {
				form: {
					...form,
					data: {
						...form.data,
						currentPassword: '',
						newPassword: '',
						confirmNewPassword: '',
					},
				},
			}
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
		locals.toast = setToast({
			title: 'Success',
			description: 'Note successfully deleted',
			type: 'success',
		})
		return redirect(302, '/settings/profile')
	},
} satisfies Actions
