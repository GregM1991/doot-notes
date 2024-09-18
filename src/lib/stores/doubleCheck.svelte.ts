import type { SubmitFunction } from '@sveltejs/kit'

export function createDoubleCheckStore(dcIds: Array<string>) {
	let doubleCheckMap = $state(Object.fromEntries(dcIds.map(id => [id, false])))

	const handleSubmit = (id: string): SubmitFunction => {
		return async ({ cancel, formElement }) => {
			const doubleCheck = doubleCheckMap[id]
			if (!doubleCheck) {
				doubleCheckMap[id] = true
				cancel()
			} else {
				doubleCheckMap[id] = false
				formElement.requestSubmit()
			}
		}
	}

	const onkeyup = (id: string) => (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			doubleCheckMap[id] = false
		}
	}
	const onblur = (id: string) => () => (doubleCheckMap[id] = false)

	const getButtonProps = (id: string) => ({
		onkeyup: onkeyup(id),
		onblur: onblur(id),
	})

	return {
		doubleCheckMap,
		handleSubmit,
		getButtonProps,
	}
}
