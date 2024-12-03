import { prisma } from '$lib/utils/db.server'
import { getDomainUrl } from '$lib/utils/misc'

export async function cleanupVideoAssets(videoId: string, request: Request) {
	if (!videoId) return

	const video = await prisma.video.findFirst({
		where: { id: videoId },
		select: { videoKey: true, thumbnailKey: true },
	})

	if (!video) return

	const baseUrl = getDomainUrl(request)
	const deleteUrls = {
		video: video.videoKey
			? `${baseUrl}/api/video/delete/${video.videoKey}`
			: null,
		thumbnail: video.thumbnailKey
			? `${baseUrl}/api/thumbnail/delete/${video.thumbnailKey}`
			: null,
	}

	const deleteAsset = async (
		url: string | null,
		assetType: 'video' | 'thumbnail',
	) => {
		if (!url) return

		try {
			const response = await fetch(url, { method: 'DELETE' })

			if (!response.ok) {
				throw new Error(
					`Server returned ${response.status}: ${await response.text()}`,
				)
			}

			console.log(`Successfully deleted ${assetType}`)
		} catch (err) {
			console.error(`Failed to delete ${assetType}:`, err)
			throw err
		}
	}

	const results = await Promise.allSettled([
		deleteUrls.video && deleteAsset(deleteUrls.video, 'video'),
		deleteUrls.thumbnail && deleteAsset(deleteUrls.thumbnail, 'thumbnail'),
	])

	results.forEach((result, index) => {
		if (result.status === 'rejected') {
			const assetType = index === 0 ? 'video' : 'thumbnail'
			console.error(`Failed to delete ${assetType}:`, result.reason)
		}
	})
}
