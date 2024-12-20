import { cleanup } from '@testing-library/svelte/svelte5'
import { beforeEach, afterEach, expect, test, vi } from 'vitest'
import { handleNewOrUpdateVideo } from './handleNewOrUpdateVideo.server'
import VideoUploadProcessor from '$lib/video/videoUploadProcessor'
import { cleanupVideoAssets } from './utils'
import type { VideoMetadata } from './types.video'
import type { BaseVideoHandler } from '$lib/video/VideoHandler/baseVideoHandler'

class MockVideoUploadProcessor extends VideoUploadProcessor {
	constructor() {
		super({} as BaseVideoHandler, 'http://localhost')
	}

	processVideoUpload = vi.fn()
	destroy = vi.fn()
}

vi.mock('$lib/video/videoUploadProcessor', () => {
	return {
		default: class {
			static initialize = vi.fn()
		},
	}
})

vi.mock('./utils', () => ({
	cleanupVideoAssets: vi.fn(),
}))

let mockUserId: string
let mockNoteId: string
let mockVideoId: string
let mockRequest: Request
let mockVideoMetadata: VideoMetadata
let mockProcessedVideo: {
	uploadedVideoKey: string
	thumbnailKey: string
	metadata: VideoMetadata
}
let mockProcessor: MockVideoUploadProcessor

beforeEach(() => {
	mockUserId = 'user123'
	mockNoteId = 'note123'
	mockVideoId = 'video123'
	mockRequest = new Request('http://localhost')

	mockVideoMetadata = {
		duration: 30,
		width: 1920,
		height: 1080,
		frameRate: 30,
		codec: 'H.264',
		fileName: 'test-video.mp4',
		bitrate: 5000000,
		originalName: 'original-video.mp4',
		contentType: 'video/mp4',
	}

	mockProcessedVideo = {
		uploadedVideoKey: 'video-key-123',
		thumbnailKey: 'thumb-key-123',
		metadata: mockVideoMetadata,
	}

	mockProcessor = new MockVideoUploadProcessor()
	mockProcessor.processVideoUpload.mockResolvedValue(mockProcessedVideo)
	vi.mocked(VideoUploadProcessor.initialize).mockResolvedValue(mockProcessor)
})

afterEach(() => {
	vi.clearAllMocks()
	cleanup()
})

test('Successfully handles new video upload', async () => {
	const formData = new FormData()
	const mockFile = new File(['test video content'], 'test.mp4', {
		type: 'video/mp4',
	})
	formData.append('video.file', mockFile)
	formData.append('video.alt-text', 'Test video')

	const result = await handleNewOrUpdateVideo(
		mockUserId,
		mockRequest,
		formData,
		undefined,
	)

	expect(result.error).toBeNull()
	expect(result.videoId).toBeNull()
})

test('Returns correct video data on successful upload', async () => {
	const formData = new FormData()
	const mockFile = new File(['test video content'], 'test.mp4', {
		type: 'video/mp4',
	})
	formData.append('video.file', mockFile)
	formData.append('video.alt-text', 'Test video')

	const result = await handleNewOrUpdateVideo(
		mockUserId,
		mockRequest,
		formData,
		undefined,
	)

	expect(result.videoData).toEqual({
		videoKey: mockProcessedVideo.uploadedVideoKey,
		thumbnailKey: mockProcessedVideo.thumbnailKey,
		altText: 'Test video',
		...mockProcessedVideo.metadata,
	})
})

test('Calls cleanup when updating existing video', async () => {
	const formData = new FormData()
	const mockFile = new File(['updated content'], 'updated.mp4', {
		type: 'video/mp4',
	})
	formData.append('video.file', mockFile)
	formData.append('video.id', mockVideoId)

	await handleNewOrUpdateVideo(mockUserId, mockRequest, formData, mockNoteId)

	expect(cleanupVideoAssets).toHaveBeenCalledWith(
		mockVideoId,
		mockNoteId,
		mockRequest,
	)
})

test('Handles empty file upload without error', async () => {
	const formData = new FormData()
	const emptyFile = new File([], 'empty.mp4', { type: 'video/mp4' })
	formData.append('video.file', emptyFile)

	const result = await handleNewOrUpdateVideo(
		mockUserId,
		mockRequest,
		formData,
		undefined,
	)

	expect(result.videoData).toBeNull()
	expect(result.error).toBeNull()
})

test('Returns validation error for file size too large', async () => {
	const formData = new FormData()
	const largeFile = new File(
		[new ArrayBuffer(105 * 1024 * 1024)],
		'large.mp4',
		{ type: 'video/mp4' },
	)
	formData.append('video.file', largeFile)

	const result = await handleNewOrUpdateVideo(
		mockUserId,
		mockRequest,
		formData,
		undefined,
	)

	expect(result.error).toBeTruthy()
	expect(Array.isArray(result.error)).toBe(true)
})

test('Returns error message when video processing fails', async () => {
	const formData = new FormData()
	const mockFile = new File(['test content'], 'test.mp4', { type: 'video/mp4' })
	const error = 'Processing failed'
	formData.append('video.file', mockFile)

	const mockError = new Error(error)
	mockProcessor.processVideoUpload.mockRejectedValueOnce(mockError)
	vi.mocked(VideoUploadProcessor.initialize).mockResolvedValueOnce(
		mockProcessor,
	)

	const result = await handleNewOrUpdateVideo(
		mockUserId,
		mockRequest,
		formData,
		undefined,
	)

	expect(result.error).toBe(error)
})
