import { error } from '@sveltejs/kit'
import { r2Client } from '$lib/storage/r2.server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'

export async function GET({ params }) {
	try {
		const { key } = params
		const command = new GetObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: decodeURIComponent(key),
		})

		const response = await r2Client.send(command)
		const contentType = response.ContentType || 'image/jpeg'

		return new Response(response.Body as ReadableStream, {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=31536000',
				...(response.ETag && { ETag: response.ETag }),
			},
		})
	} catch (err) {
		console.error(`Error fetching thumbnail ${params.key}:`, err)
		throw error(404, 'Thumbnail not found')
	}
}
