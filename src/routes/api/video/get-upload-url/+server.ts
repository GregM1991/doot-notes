import { error, json } from '@sveltejs/kit'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { UploadPartCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'

export async function POST({ request }) {
	try {
		const { uploadId, partNumber } = await request.json()

		// Generate presigned URL for part upload
		const command = new UploadPartCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: uploadId,
			UploadId: uploadId,
			PartNumber: partNumber,
			// ContentType is not needed here - it's set during initialization
		})

		const presignedUrl = await getSignedUrl(r2Client, command, {
			expiresIn: 3600,
		})
		return json({ url: presignedUrl })
	} catch (err) {
		console.error('Failed to generate presigned URL:', err)
		throw error(500, 'Failed to generate upload URL')
	}
}
