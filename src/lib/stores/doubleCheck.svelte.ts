import type { SubmitFunction } from '@sveltejs/kit'

export function createDoubleCheckStore() {
	let doubleCheck = $state(false)

	const handleSubmit: SubmitFunction = async ({ cancel, formElement }) => {
		if (!doubleCheck) {
			doubleCheck = true
			cancel()
		} else {
			doubleCheck = false
			formElement.requestSubmit()
		}
	}
	const onkeyup = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			doubleCheck = false
		}
	}
	const onblur = () => {
		doubleCheck = false
	}
	const getButtonProps = () => {
		return {
			onkeyup: callAll(onkeyup),
			onblur: callAll(onblur),
		}
	}

	return {
		get doubleCheck() {
			return doubleCheck
		},
		handleSubmit,
		getButtonProps,
	}
}

function callAll<Args extends Array<unknown>>(
	...fns: Array<((...args: Args) => unknown) | undefined>
) {
	return (...args: Args) => fns.forEach(fn => fn?.(...args))
}
