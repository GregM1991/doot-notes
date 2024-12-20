import { json } from '@sveltejs/kit'
import {
	CompleteMultipartUploadCommand,
	ListPartsCommand,
} from '@aws-sdk/client-s3'
import { env } from '$env/dynamic/private'
import { r2Client } from '$lib/storage/r2.server.js'
import {
	createVideoUploadError,
	VideoErrorCode,
} from '$lib/video/videoUploadErrors.js'

export async function POST({ request }) {
	try {
		const { uploadId, uploadKey } = await request.json()

		const listPartsCommand = new ListPartsCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: uploadKey,
			UploadId: uploadId,
		})

		const partsList = await r2Client.send(listPartsCommand)

		const command = new CompleteMultipartUploadCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: uploadKey,
			UploadId: uploadId,
			MultipartUpload: {
				Parts: partsList.Parts?.map(part => ({
					PartNumber: part.PartNumber,
					ETag: part.ETag,
				})),
			},
		})

		const result = await r2Client.send(command)
		return json({ key: result.Key })
	} catch (err) {
		console.error('Failed to complete upload:', err)
		throw createVideoUploadError(VideoErrorCode.CHUNK_UPLOAD_FAILED)
	}
}
