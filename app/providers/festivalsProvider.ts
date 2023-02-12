import type Festival from '~/entities/Festival'
import client from '../db/createClient'

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
