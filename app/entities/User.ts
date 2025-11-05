import createId from 'uniqid'
import { z } from 'zod'

export type User = {
  id: string
  username: string
  password: string
}

export const createUser = (
  userData: Partial<User> & Record<string, unknown>,
) => {
  const schema = z.object({
    id: z.string().default(createId()),
    username: z.string(),
    password: z.string(),
  })

  const validatedUserData = schema.parse(userData)

  return validatedUserData
}
