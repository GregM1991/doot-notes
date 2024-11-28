import { error, json } from '@sveltejs/kit'
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'

export async function POST({ request }) {
	try {
		const { uploadKey, contentType } = await request.json()

		const command = new CreateMultipartUploadCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: uploadKey,
			ContentType: contentType,
		})

		const result = await r2Client.send(command)

		return json({ uploadId: result.UploadId, uploadKey: result.Key })
	} catch (err) {
		console.error('Failed to initialize upload:', err)
		throw error(500, 'Failed to initialize upload')
	}
}
