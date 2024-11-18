// set up prisma client here so that it does not run on every hot module replacement
// use chalk for nice colors
import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'
// import { building } from '$app/environment'

const isProduction = process.env.NODE_ENV === 'production'

/* NOTE: If you make any changes in this file, you will need to restart the server
   as any changes will not be HMR'd */

const logThreshold = 20
export const prisma = new PrismaClient({
	log: [
		{ level: 'query', emit: 'event' },
		{ level: 'error', emit: 'stdout' },
		{ level: 'warn', emit: 'stdout' },
	],
})

prisma.$on('query', async event => {
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

if (isProduction) {
	await prisma.$connect()
}
