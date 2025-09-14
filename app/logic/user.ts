import type User from '~/entities/User'
import usersProvider from '~/providers/usersProvider'
import config from '~/config'
import { compare, genSalt, hash } from 'bcryptjs'
import uniqid from 'uniqid'
import { getSession } from './session'

export const getUserFromRequest = async (request: Request): Promise<User | undefined> => {
  const session = await getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')
  const user = await usersProvider.getUserByField('id', userId)

  return user ?? undefined
}

// eslint-disable-next-line max-len
export const authenticateUser = async (
  username: string,
  password: string,
): Promise<[boolean, User | null]> => {
  const user = await usersProvider.getUserByField('username', username)

  return [await compare(password, user?.password ?? ''), user]
}

export const validateToken = (incomingToken: string): boolean =>
  incomingToken !== config.registerToken

export const userAlreadyExists = async (incomingUsername: string): Promise<boolean> =>
  (await usersProvider.getUserByField('username', incomingUsername)) !== null

export const createNewUser = async (username: string, password: string): Promise<void> => {
  const salt = await genSalt()
  const encryptedPassword = await hash(password, salt)

  await usersProvider.addNewUser({
    id: uniqid(),
    username,
    password: encryptedPassword,
  })
}
