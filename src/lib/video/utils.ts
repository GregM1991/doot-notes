import { prisma } from '$lib/utils/db.server'
import { getDomainUrl } from '$lib/utils/misc'

export async function cleanupVideoAssets(
	videoId: string,
	noteId: string | undefined,
	request: Request,
) {
	if (!videoId && !noteId) {
		console.log('No video or note ID provided for cleanup')
		return
	}

	try {
		const existingVideo = await prisma.video.findFirst({
			where: {
				AND: [videoId ? { id: videoId } : {}, noteId ? { noteId: noteId } : {}],
			},
			select: {
				id: true,
				thumbnailKey: true,
				videoKey: true,
				noteId: true,
			},
		})

		if (!existingVideo) {
			return
		}

		const baseUrl = getDomainUrl(request)
		const deleteUrls = {
			video: existingVideo.videoKey
				? `${baseUrl}/api/video/delete/${existingVideo.videoKey}`
				: null,
			thumbnail: existingVideo.thumbnailKey
				? `${baseUrl}/api/thumbnail/delete/${existingVideo.thumbnailKey}`
				: null,
		}

		const deleteAsset = async (
			url: string | null,
			assetType: 'video' | 'thumbnail',
		): Promise<void> => {
			if (!url) {
				return
			}

			try {
				const response = await fetch(url, {
					method: 'DELETE',
					signal: AbortSignal.timeout(5000),
				})

				if (!response.ok) {
					throw new Error(
						`Server returned ${response.status}: ${await response.text()}`,
					)
				}
			} catch (err) {
				console.error(`Failed to delete ${assetType}:`, err)
				return
			}
		}

		await prisma.$transaction(async tx => {
			await tx.video.delete({
				where: { id: existingVideo.id },
			})

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
		})
	} catch (error) {
		console.error('Error during video cleanup:', error)
		throw new Error('Failed to clean up video assets')
	}
}
