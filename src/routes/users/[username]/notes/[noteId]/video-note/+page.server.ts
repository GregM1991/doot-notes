import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'
import { invariantResponse } from '$lib/utils/misc.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const load = async ({ parent }) => {
	const parentData = await parent()
	invariantResponse(
		parentData.note?.video?.videoKey,
		'Note does not have video file',
	)

	const command = new GetObjectCommand({
		Bucket: env.R2_BUCKET_NAME,
		Key: decodeURIComponent(parentData.note.video.videoKey),
	})

	const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

	// TODO: Figure out if this whole presignedUrl is the best thing for vidoes
	return {
		fileName: parentData.note.video.fileName,
		videoUrl: signedUrl,
		headers: {
			'Cache-Control': 'private, max-age=3600',
		},
	}
}
