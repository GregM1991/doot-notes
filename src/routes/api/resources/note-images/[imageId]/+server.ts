import { prisma } from '$lib/utils/db.server.js'
import { invariantResponse } from '$lib/utils/misc.js'

export async function GET({ params }) {
	invariantResponse(params.imageId, 'Image ID is required', 400)

	const image = await prisma.noteImage.findUnique({
		where: { id: params.imageId },
		select: { contentType: true, blob: true },
	})

	invariantResponse(image, 'Not found', 400)

	return new Response(image.blob, {
		headers: {
			'Content-Type': image.contentType,
			'Content-Length': Buffer.byteLength(image.blob).toString(),
			'Content-Disposition': `inline; filename="${params.imageId}"`,
			'Cache-Control': 'public, max-age=3153600, immutable',
		},
	})
}
