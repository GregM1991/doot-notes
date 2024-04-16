import {
	NoteEditorSchema,
	type ImageFieldset,
} from '$lib/components/EditNote/types'

type InitialValue = {
	id: null
	title: string
	content: string
	images: Array<ImageFieldset> | Array<{}>
}

export function parseNewOrEditResult(
	note: InitialValue,
	initialValue: InitialValue,
) {
	const result = NoteEditorSchema.transform(data => {
		return {
			id: null,
			title: data?.title ?? '',
			content: data?.content ?? '',
			images: data?.images ?? [{}],
		}
	}).safeParse(initialValue)
	return result.success ? { ...note, ...result.data } : note
}

export function removeButtonValue(index: number) {
	return JSON.stringify({ type: 'remove', payload: { name: 'images', index } })
}
