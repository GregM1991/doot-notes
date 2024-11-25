import { error, json } from '@sveltejs/kit'
import { CreateMultipartUploadCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'

export async function POST({ request }) {
	try {
		const { uploadId, contentType } = await request.json()

		// Create multipart upload in R2
		const command = new CreateMultipartUploadCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: uploadId,
			ContentType: contentType,
		})

		await r2Client.send(command)
		return json({ success: true })
	} catch (err) {
		console.error('Failed to initialize upload:', err)
		throw error(500, 'Failed to initialize upload')
	}
}
