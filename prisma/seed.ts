/* TODO: will need
faker,
promiseHash,
~~ tests db utils ~~
createPassword,
getNoteImages,
getUserImages,
img */
import { prisma } from '$lib/utils/db.server'
import { createUser, cleanupDb } from '$tests/db-utils'
import { faker } from '@faker-js/faker'

// create function seed, is main function where all seed logic sits
async function seed() {
	console.log('🌱 seeding')
	console.time('🌱 database has been seeded')

	console.time('🧹 cleaned up database')
	await cleanupDb(prisma)
	console.timeEnd('🧹 cleaned up database')

	// TODO: 🔑 create permissions

	// TODO: 👑 create roles

	const totalUsers = 5
	console.time(`👫 created ${totalUsers} users...`)
	for (let i = 0; i < totalUsers; i++) {
		const userData = createUser()
		await prisma.user.create({
			select: { id: true },
			data: {
				...userData,
				notes: {
					create: Array.from({
						length: faker.number.int({ min: 5, max: 10 }),
					}).map(() => ({
						title: faker.lorem.sentence({ min: 1, max: 5 }),
						content: faker.lorem.paragraphs(10),
					})),
				},
				// TODO: add password, image, roles, notes
			},
		})
	}
	console.timeEnd(`👫 created ${totalUsers} users...`)
	console.timeEnd('🌱 database has been seeded')
	// TODO: 🐨 create admin user
}

await seed()
	.catch(err => {
		console.error(err)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect())
