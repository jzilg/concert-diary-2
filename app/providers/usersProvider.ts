import type { User } from '~/entities/User'
import client from '../db/client'

const DB = 'concert-diary'
const COLLECTION = 'users'

type UsersProvider = {
  getUserByField(field: 'id' | 'username', value: string): Promise<User | null>
  addNewUser(user: User): Promise<void>
}

const usersProvider: UsersProvider = {
  async getUserByField(field, value) {
    try {
      await client.connect()
      const db = client.db(DB)
      const collection = db.collection(COLLECTION)
      const query = { [field]: value }

      const user = await collection.findOne(query)

      return user as unknown as User
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
