import type { ImageFieldset } from './types.editNote'

export const generateCopy = (formId: string | undefined, title: string) => ({
	header: formId ? `Edit ${title}` : 'Doot a new note 📯',
	buttonText: formId ? 'Save changes' : 'Create note',
	submitDelayedReason: formId ? 'Updating note' : 'Creating note',
})

export function createState(images: Array<ImageFieldset> | undefined) {
	let state = $state({
		imageList: images?.length
			? images
			: [{ id: undefined, file: undefined, altText: undefined }],
	})

	return {
		state,
		addEmptyImage() {
			state.imageList = [
				...state.imageList,
				{ id: undefined, file: undefined, altText: undefined },
			]
		},
		deleteImage(index: number) {
			state.imageList = state.imageList.filter((_, i) => i !== index)
		},
	}
}
