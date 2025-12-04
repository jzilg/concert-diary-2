import client from '~/db/client'
import type { Festival } from '~/entities/Festival'
import { createFestival } from '~/entities/Festival'

const DB = 'concert-diary'
const COLLECTION = 'festivals'

const festivalsProvider = (userId: string) => {
  const collectionName = `${COLLECTION}-${userId}`

  return {
    async getAll() {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const cursor = collection.find()
        const festivalDataList = await cursor.toArray()

        return festivalDataList.map((festivalData) =>
          createFestival(festivalData),
        )
      } finally {
        await client.close()
      }
    },

    async getById(id: string) {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const query = { id }
        const festivalData = await collection.findOne(query)

        if (festivalData === null) {
          return undefined
        }

        return createFestival(festivalData)
      } finally {
        await client.close()
      }
    },

    async add(festival: Festival) {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)

        await collection.insertOne(festival)

        return festival
      } finally {
        await client.close()
      }
    },

    async update(id: string, festival: Festival) {
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

    async remove(id: string) {
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
