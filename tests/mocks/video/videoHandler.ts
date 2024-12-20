import { ServerVideoHandler } from '$lib/video/VideoHandler/serverVideoHandler.server'
import type { MetadataOptions } from '$lib/video/types.video'
import { vi } from 'vitest'

export default class MockVideoHandler extends ServerVideoHandler {
	getVideoMetadata = vi
		.fn()
		.mockImplementation(
			async (_videoBuffer: Buffer | File, options?: MetadataOptions) => {
				return {
					duration: 30,
					width: 1920,
					height: 1080,
					frameRate: 30,
					codec: 'H.264',
					fileName: options?.fileName || 'test.mp4',
					bitrate: 5000000,
					originalName: options?.originalName || 'test.mp4',
					contentType: options?.contentType || 'video/mp4',
				}
			},
		)
	appendVideoChunk = vi.fn()
	generatePreview = vi
		.fn()
		.mockImplementation(async (_videoData: Buffer | File) => {
			return new Blob(['mock-preview'], { type: 'image/jpeg' })
		})
	destroy = vi.fn()
}
