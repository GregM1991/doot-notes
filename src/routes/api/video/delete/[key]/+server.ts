// api/video/delete/[key]/+server.ts
import { error } from '@sveltejs/kit'
import { r2Client } from '$lib/storage/r2.server'
import { DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'

export async function DELETE({ params }) {
	const { key } = params

	try {
		const headCommand = new HeadObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
		})

		console.log('Checking object in bucket:', env.R2_BUCKET_NAME)

		try {
			await r2Client.send(headCommand)
		} catch (err) {
			console.error('Head check failed:', err)
			throw error(404, 'Object not found')
		}

		const deleteCommand = new DeleteObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
		})

		await r2Client.send(deleteCommand)

		return new Response(null, {
			status: 204,
		})
	} catch (err) {
		console.error(`Error deleting video ${params.key}:`, err)
		throw error(500, 'Internal server error')
	}
}
