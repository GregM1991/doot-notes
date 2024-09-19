import { getNoteImgSrc } from '$lib/utils/misc'
import type { ImageFieldset } from '../EditNote/types.editNote'

export function createState(initialValue: ImageFieldset | undefined) {
	let state: { previewImage: string | null } = $state({
		previewImage: initialValue?.id ? getNoteImgSrc(initialValue?.id) : null,
	})
	let existingImage = $derived(
		initialValue?.id ? getNoteImgSrc(initialValue?.id) : null,
	)

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				state.previewImage = reader.result as string
			}
			reader.readAsDataURL(file)
		} else {
			state.previewImage = null
		}
	}

	return {
		state,
		get existingImage() {
			return existingImage
		},
		handleFileChange,
	}
}
