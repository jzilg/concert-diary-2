import client from '~/db/client'
import { createUser, type User } from '~/entities/User'

const DB = 'concert-diary'
const COLLECTION = 'users'

type UsersProvider = {
  getUserByField(
    field: 'id' | 'username',
    value: string,
  ): Promise<User | undefined>
  addNewUser(user: User): Promise<void>
}

const usersProvider: UsersProvider = {
  async getUserByField(field, value) {
    try {
      await client.connect()
      const db = client.db(DB)
      const collection = db.collection(COLLECTION)
      const query = { [field]: value }

      const userData = await collection.findOne(query)

      if (userData === null) {
        return undefined
      }

      return createUser(userData)
    } finally {
      await client.close()
    }
  },

  async addNewUser(user) {
    try {
      await client.connect()
      const db = client.db(DB)
      const collection = db.collection(COLLECTION)

      await collection.insertOne(user)
    } finally {
      await client.close()
    }
  },
}

export default usersProvider
