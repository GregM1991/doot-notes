// set up prisma client here so that it does not run on every hot module replacement
// use chalk for nice colors
import { PrismaClient } from '@prisma/client'
import { remember } from '@epic-web/remember'
import chalk from 'chalk'

/* NOTE: If you make any changes in this file, you will need to restart the server
   as any changes will not be HMR'd */
export const prisma = remember('prisma', () => {
	const logThreshold = 20
	const client = new PrismaClient({
		log: [
			{ level: 'query', emit: 'event' },
			{ level: 'error', emit: 'stdout' },
			{ level: 'warn', emit: 'stdout' },
		],
	})

	client.$on('query', async event => {
		if (event.duration < logThreshold) return

		const color =
			event.duration < logThreshold * 1.1
				? 'green'
				: event.duration < logThreshold * 1.2
					? 'blue'
					: event.duration < logThreshold * 1.3
						? 'yellow'
						: event.duration < logThreshold * 1.4
							? 'redBright'
							: 'red'
		const dur = chalk[color](`${event.duration}ms`)
		console.info(`prisma:query - ${dur} - ${event.query}`)
	})

	client.$connect()
	return client
})
