import { requireUserId } from '$lib/utils/auth.server'
import { prisma } from '$lib/utils/db.server'
import { getDomainUrl } from '$lib/utils/misc'
import { json } from '@sveltejs/kit'

export async function GET({ request, locals }) {
	const userId = requireUserId(locals.userId, request)
	const user = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
		/* Generally you wanna stay away from includes, but for this instance it makes
			sense because we want to return all the user data. Regularly you should use
			"select" to be specific. We're using select for the images, as we don't want
			to return the whole blob, but a url they can use to dl the image. */
		include: {
			image: {
				select: {
					id: true,
					createdAt: true,
					updatedAt: true,
					contentType: true,
				},
			},
			notes: {
				include: {
					images: {
						select: {
							id: true,
							createdAt: true,
							updatedAt: true,
							contentType: true,
						},
					},
				},
			},
			password: false, // <-- don't send back password, that's a big bad
			sessions: true,
		},
	})

	const domain = getDomainUrl(request)

	return json({
		user: {
			...user,
			image: user.image
				? {
						...user.image,
						url: `${domain}/resources/user-images/${user.image.id}`,
					}
				: null,
			notes: user.notes.map(note => ({
				...note,
				images: note.images.map(image => ({
					...image,
					url: `${domain}/resources/note-images/${image.id}`,
				})),
			})),
		},
	})
}
