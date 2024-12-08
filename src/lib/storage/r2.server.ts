import { S3Client } from '@aws-sdk/client-s3'
import { createId } from '@paralleldrive/cuid2'
import { env } from '$env/dynamic/private'

export const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
})

export function generateVideoKey(fileExtension: string): string {
	return `videos/${createId()}${fileExtension}`
}
