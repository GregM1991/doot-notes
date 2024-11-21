import { env } from '$env/dynamic/private'
import { generateVideoKey, r2Client } from '$lib/storage/r2.server'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function getVideoKeyFromFile(file: File | undefined) {
	if (!file) return null

	const { name } = file
	const key = generateVideoKey(name.slice(name.lastIndexOf('.')))

	const command = new PutObjectCommand({
		Bucket: env.R2_BUCKET_NAME,
		Key: key,
		Body: Buffer.from(await file.arrayBuffer()),
		ContentType: file.type,
	})
	await r2Client.send(command)

	return key
}
