import bcrypt from 'bcryptjs'
import uniqid from 'uniqid'
import config from '~/config'
import usersProvider from '~/providers/usersProvider'
import { getSession } from './session'

const { compare, genSalt, hash } = bcrypt

export const getUserFromRequest = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')
  const user = await usersProvider.getUserByField('id', userId)

  return user ?? undefined
}

export const authenticateUser = async (username: string, password: string) => {
  const user =
    (await usersProvider.getUserByField('username', username)) ?? undefined

  return [await compare(password, user?.password ?? ''), user] as const
}

export const validateToken = (incomingToken: string): boolean =>
  incomingToken !== config.registerToken

export const userAlreadyExists = async (incomingUsername: string) =>
  (await usersProvider.getUserByField('username', incomingUsername)) !== null

export const createNewUser = async (username: string, password: string) => {
  const salt = await genSalt()
  const encryptedPassword = await hash(password, salt)

  await usersProvider.addNewUser({
    id: uniqid(),
    username,
    password: encryptedPassword,
  })
}
