export type Message = {
	type: 'error' | 'success'
	text: string
}

export type ImageMap = {
	id?: string
	index?: string | null
	altText?: string
	file?: File
}