export class UploadTracker {
	private uploadId = ''
	private parts = new Map<number, string>()
	private calls = {
		video: {
			abort: 0,
			complete: 0,
			initialize: 0,
		},
		thumbnail: {
			upload: 0,
		},
	}

	getUploadId() {
		return this.uploadId
	}
	setUploadId(id: string) {
		this.uploadId = id
	}
	getParts() {
		return this.parts
	}
	addParts(key: number, part: string) {
		this.parts.set(key, part)
	}
	getCalls() {
		return this.calls
	}

	reset() {
		this.uploadId = ''
		this.parts.clear()
		Object.keys(this.calls.video).forEach(key => {
			this.calls.video[key as keyof typeof this.calls.video] = 0
		})
		Object.keys(this.calls.thumbnail).forEach(key => {
			this.calls.thumbnail[key as keyof typeof this.calls.thumbnail] = 0
		})
	}
}
