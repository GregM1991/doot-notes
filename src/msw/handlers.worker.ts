import { http } from 'msw'
import { values } from './fixtures/msw-demo'
import { json } from '@sveltejs/kit'

export const handlers = [
	http.get('/msw/demo/__data.json', () => {
		return json({ status: 200, values })
	}),
]
