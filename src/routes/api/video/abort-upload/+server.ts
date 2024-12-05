// api/video/abort-upload/+server.ts
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'
import { AbortMultipartUploadCommand } from '@aws-sdk/client-s3'
import { error, json } from '@sveltejs/kit'

export async function POST({ request }) {
	try {
		const { uploadId, videoKey } = await request.json()

		const command = new AbortMultipartUploadCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: videoKey,
			UploadId: uploadId,
		})

		await r2Client.send(command)
		return json({ success: true })
	} catch (err) {
		console.error('Failed to abort upload:', err)
		throw error(500, 'Failed to abort upload')
	}
}
