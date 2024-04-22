export function removeButtonValue(index: number) {
	return JSON.stringify({ type: 'remove', payload: { name: 'images', index } })
}
