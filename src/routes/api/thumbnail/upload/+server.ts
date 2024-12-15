import { json } from '@sveltejs/kit'
import { r2Client } from '$lib/storage/r2.server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '$env/dynamic/private'
import { z } from 'zod'
import {
	createVideoUploadError,
	VideoErrorCode,
	VideoUploadError,
} from '$lib/video/videoUploadErrors.js'

const uploadRequestSchema = z.object({
	key: z.string(),
	videoThumbnailBlob: z.instanceof(Blob),
	contentType: z.literal('image/jpeg'),
})

export async function POST({ request }) {
	try {
		const body = await request.json()
		const result = uploadRequestSchema.safeParse(body)

		if (!result.success) {
			return json({ error: 'Invalid request' }, { status: 400 })
		}

		const { key, contentType } = result.data

		const command = new PutObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: key,
			ContentType: contentType,
			CacheControl: 'public, max-age=31536000',
		})

		const uploadUrl = await getSignedUrl(r2Client, command, {})

		const uploadResponse = await fetch(uploadUrl, {
			method: 'PUT',
			body: result.data.videoThumbnailBlob,
			headers: { 'Content-Type': 'image/jpeg' },
		})

		if (!uploadResponse.ok) {
			throw createVideoUploadError(
				VideoErrorCode.UPLOAD_THUMBNAIL_FAILED,
				await uploadResponse.text(),
			)
		}

		return json({ uploadUrl })
	} catch (error) {
		console.error('Failed to generate upload URL:', error)
		if (error instanceof VideoUploadError) {
			throw error
		}

		throw createVideoUploadError(VideoErrorCode.UPLOAD_THUMBNAIL_FAILED, error)
	}
}
