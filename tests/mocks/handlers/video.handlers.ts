import { http, HttpResponse } from 'msw'
import { UploadTracker, mockResponses } from '$tests/mocks/video'

export const createVideoHandlers = (passedTracker?: UploadTracker) => {
	const tracker = passedTracker || new UploadTracker()
	return [
		http.post('http://localhost/api/thumbnail/upload', async () => {
			tracker.getCalls().thumbnail.upload++

			return HttpResponse.json({ uploadUrl: mockResponses.thumbnailUrl })
		}),

		http.post('http://localhost/api/video/initialize-upload', async () => {
			tracker.getCalls().video.initialize++

			tracker.setUploadId(mockResponses.uploadId)

			return HttpResponse.json({
				uploadId: mockResponses.uploadId,
				uploadKey: mockResponses.uploadKey,
			})
		}),

		http.post('http://localhost/api/video/get-upload-url', async () => {
			return HttpResponse.json(mockResponses.presignedUrl)
		}),

		http.post('http://localhost/api/video/complete-upload', async () => {
			tracker.getCalls().video.complete++
			return HttpResponse.json({ key: mockResponses.uploadKey })
		}),

		http.post('http://localhost/api/video/abort-upload', async () => {
			tracker.getCalls().video.abort++
			return HttpResponse.json({ success: true })
		}),

		http.put(mockResponses.presignedUrl, async ({ request }) => {
			const partNumber = Number(
				new URL(request.url).searchParams.get('partNumber'),
			)
			tracker.addParts(partNumber, 'mock-etag')

			return new HttpResponse(null, { status: 200 })
		}),

		http.put(mockResponses.thumbnailUrl, () => {
			return new HttpResponse(null, { status: 200 })
		}),
	]
}
