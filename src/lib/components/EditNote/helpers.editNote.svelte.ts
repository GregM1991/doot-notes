import type { ImageFieldset } from './types.editNote'

export const generateCopy = (formId: string | undefined, title: string) => ({
	header: formId ? `Edit ${title}` : 'Doot a new note 📯',
	buttonText: formId ? 'Save changes' : 'Create note',
	submitDelayedReason: formId ? 'Updating note' : 'Creating note',
})

export function createState(images: Array<ImageFieldset> | undefined) {
	let imageList = $state(
		images?.length
			? images
			: [{ id: undefined, file: undefined, altText: undefined }],
	)

	return {
		get imageList() {
			return imageList
		},
		set imageList(value: Array<ImageFieldset>) {
			imageList = value
		},
		addEmptyImage() {
			imageList = [
				...imageList,
				{ id: undefined, file: undefined, altText: undefined },
			]
		},
		deleteImage(index: number) {
			imageList = imageList.filter((_, i) => i !== index)
		},
	}
}
