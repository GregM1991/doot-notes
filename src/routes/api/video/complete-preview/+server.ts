import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function POST({ request }) {
	try {
		const { uploadId } = await request.json()

		const command = new GetObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: `${uploadId}`,
		})

		const previewUrl = await getSignedUrl(r2Client, command, {
			expiresIn: 3600,
		})
		return json(previewUrl)
	} catch (err) {
		console.error('Failed to complete preview:', err)
		throw error(500, 'Failed to complete preview upload')
	}
}
