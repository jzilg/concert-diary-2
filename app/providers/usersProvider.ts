import client from '~/db/client'
import { createUser, type User } from '~/entities/User'

const DB = 'concert-diary'
const COLLECTION = 'users'

const usersProvider = {
  async getUserByField(field: 'id' | 'username', value: string) {
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

  async addNewUser(user: User) {
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
