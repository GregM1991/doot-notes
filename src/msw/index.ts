import { browser, dev } from '$app/environment'

/*
  TODO: Get a greater understanding of mocking requests
  Below link is an article on sveltekit and msw:
  https://flaming.codes/en/posts/msw-in-sveltekit-for-local-development/ 
*/
export async function inject() {
	if (dev && browser) {
		const { worker } = await import('./worker')
		return worker.start({ onUnhandledRequest: 'bypass' }).catch(console.warn)
	}
	if (dev && !browser) {
		const { server } = await import('./server.server')
		return server.listen({ onUnhandledRequest: 'bypass' })
	}
}
