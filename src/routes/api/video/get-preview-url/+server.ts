import { error, json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function POST({ request }) {
	try {
		const { key, contentType } = await request.json()

		const putCommand = new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			ContentType: contentType,
		})

		const [uploadUrl] = await Promise.all([
			getSignedUrl(r2Client, putCommand, { expiresIn: 3600 }),
		])

		return json({ uploadUrl })
	} catch (err) {
		console.error('Failed to get preview URLs:', err)
		throw error(500, 'Failed to get preview upload URL')
	}
}
