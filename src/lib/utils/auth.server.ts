import { type Password, type User } from '@prisma/client'
import { prisma } from './db.server'
import bcrypt from 'bcryptjs'

export async function login({
	username,
	password,
}: {
	username: User['username']
	password: string
}) {
	const user = verifyUserPassword({ username }, password)

  if (!user) return null

  const session = await prisma.
}

async function verifyUserPassword(
	where: Pick<User, 'username'> | Pick<User, 'id'>,
	password: Password['hash'],
) {
	const userWithPassword = await prisma.user.findUnique({
		where,
		select: { id: true, password: { select: { hash: true } } },
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

	if (!isValid) {
		return null
	}

	return { id: userWithPassword.id }
}
