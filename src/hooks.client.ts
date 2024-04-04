import { dev } from '$app/environment'

if (dev) {
	const { worker } = await import('$msw/worker')

	await worker.start({
		onUnhandledRequest(request, print) {
			// Do not warn on unhandled internal Svelte requests.
			// Those are not meant to be mocked.
			if (request.url.includes('svelte')) {
				return
			}

			print.warning()
		},
	})
}
