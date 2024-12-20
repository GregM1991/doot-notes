import { cleanup } from '@testing-library/svelte/svelte5'
import { beforeEach, afterEach, expect, test, vi, describe } from 'vitest'
import VideoUploadProcessor from './videoUploadProcessor'
import type { VideoMetadata } from './types.video'
import { http, HttpResponse } from 'msw'
import { server } from '$tests/mocks'
import MockVideoHandler from '$tests/mocks/video/videoHandler'
import { UploadTracker } from '$tests/mocks/video'

let processor: VideoUploadProcessor
let mockHandler: MockVideoHandler
let mockMetadata: VideoMetadata
let tracker: UploadTracker

beforeEach(() => {
	mockHandler = new MockVideoHandler()
	tracker = new UploadTracker()
	mockMetadata = {
		duration: 30,
		width: 1920,
		height: 1080,
		frameRate: 30,
		codec: 'H.264',
		fileName: 'test.mp4',
		bitrate: 5000000,
		originalName: 'test.mp4',
		contentType: 'video/mp4',
	}

	mockHandler.getVideoMetadata.mockResolvedValue(mockMetadata)
	mockHandler.generatePreview.mockResolvedValue(
		new Blob(['mock-preview'], { type: 'image/jpeg' }),
	)

	processor = new VideoUploadProcessor(mockHandler, 'http://localhost')
})

afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})

describe('upload process', () => {
	test('successfully processes complete upload flow', async () => {
		const file = new File(['test video content'], 'test.mp4', {
			type: 'video/mp4',
		})

		const result = await processor.processVideoUpload(file, 'test-user')

		expect(result).toEqual({
			uploadedVideoKey: expect.any(String),
			thumbnailKey: expect.any(String),
			metadata: expect.objectContaining(mockMetadata),
		})

		expect(tracker.getParts().size).toBeGreaterThan(0)
	})

	test('handles upload errors gracefully', async () => {
		const file = new File(['test content'], 'test.mp4', { type: 'video/mp4' })

		server.use(
			http.post('http://localhost/api/video/complete-upload', () => {
				return new HttpResponse(null, { status: 500 })
			}),
		)

		await expect(
			processor.processVideoUpload(file, 'test-user'),
		).rejects.toThrow()

		expect(tracker.getUploadId()).not.toBe('')
	})
})
