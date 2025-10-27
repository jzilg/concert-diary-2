import bcrypt from 'bcryptjs'
import config from '~/config'
import { createUser } from '~/entities/User'
import usersProvider from '~/providers/usersProvider'

const { compare, genSalt, hash } = bcrypt

export const getUserById = async (userId: string) =>
  await usersProvider.getUserByField('id', userId)

export const getAuthenticatedUser = async (
  username: string,
  password: string,
) => {
  const user = await usersProvider.getUserByField('username', username)
  const userIsAuthenticated = await compare(password, user?.password ?? '')

  return userIsAuthenticated ? user : undefined
}

export const validateToken = (incomingToken: string) =>
  incomingToken !== config.registerToken

export const userAlreadyExists = async (incomingUsername: string) =>
  (await usersProvider.getUserByField('username', incomingUsername)) !==
  undefined

export const createNewUser = async (username: string, password: string) => {
  const salt = await genSalt()
  const hashedPassword = await hash(password, salt)

  await usersProvider.addNewUser(
    createUser({
      username,
      password: hashedPassword,
    }),
  )
}
