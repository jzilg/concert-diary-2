import type Festival from '~/entities/Festival'
import createClient from '../db/createClient'

const DB = 'concert-diary'
const COLLECTION = 'festivals'

type FestivalsProvider = (userId: string) => ({
  getAll(): Promise<Festival[]>
  getById(id: string): Promise<Festival>
  add(festival: Festival): Promise<Festival>
  update(id: string, festival: Festival): Promise<Festival>
  remove(id: string): Promise<void>
})

const festivalsProvider: FestivalsProvider = (userId) => {
  const collectionName = `${COLLECTION}-${userId}`

  return {
    async getAll() {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const cursor = collection.find()

        const festivals = await cursor.toArray()

        return festivals as unknown as Festival[]
      } finally {
        await client.close()
      }
    },

    async getById(id) {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const query = { id }

        const festival = await collection.findOne(query)

        return festival as unknown as Festival
      } finally {
        await client.close()
      }
    },

    async add(festival) {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)

        await collection.insertOne({ ...festival })

        return festival
      } finally {
        await client.close()
      }
    },

    async update(id, festival) {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const query = { id }
        const document = {
          $set: festival,
        }

        await collection.updateOne(query, document)

        return festival
      } finally {
        await client.close()
      }
    },

    async remove(id) {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const query = { id }

        await collection.deleteOne(query)
      } finally {
        await client.close()
      }
    },
  }
}

export default festivalsProvider
