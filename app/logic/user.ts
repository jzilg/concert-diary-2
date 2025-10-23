import bcrypt from 'bcryptjs'
import uniqid from 'uniqid'
import config from '~/config'
import usersProvider from '~/providers/usersProvider'

const { compare, genSalt, hash } = bcrypt

export const getUserById = async (userId: string) =>
  (await usersProvider.getUserByField('id', userId)) ?? undefined

export const getAuthenticatedUser = async (
  username: string,
  password: string,
) => {
  const user =
    (await usersProvider.getUserByField('username', username)) ?? undefined
  const userIsAuthenticated = await compare(password, user?.password ?? '')

  return userIsAuthenticated ? user : undefined
}

export const validateToken = (incomingToken: string) =>
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
