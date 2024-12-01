import { error } from '@sveltejs/kit'
import { r2Client } from '$lib/storage/r2.server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function GET({ params }) {
	try {
		const { key } = params
		const command = new GetObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: decodeURIComponent(key),
		})

		const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

		return new Response(JSON.stringify({ url: signedUrl }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'private, max-age=3600',
			},
		})
	} catch (err) {
		console.error(`Error generating signed URL for video ${params.key}:`, err)
		throw error(404, 'Video not found')
	}
}
