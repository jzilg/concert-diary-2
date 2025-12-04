import client from '~/db/client'
import type { Concert } from '~/entities/Concert'
import { createConcert } from '~/entities/Concert'

const DB = 'concert-diary'
const COLLECTION = 'concerts'

const concertsProvider = (userId: string) => {
  const collectionName = `${COLLECTION}-${userId}`

  return {
    async getAll() {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const cursor = collection.find()
        const concertDataList = await cursor.toArray()

        return concertDataList.map((concertData) => createConcert(concertData))
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
        const concertData = await collection.findOne(query)

        if (concertData === null) {
          return undefined
        }

        return createConcert(concertData)
      } finally {
        await client.close()
      }
    },

    async add(concert: Concert) {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)

        await collection.insertOne(concert)

        return concert
      } finally {
        await client.close()
      }
    },

    async update(id: string, concert: Concert) {
      try {
        await client.connect()

        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const query = { id }
        const document = {
          $set: concert,
        }

        await collection.updateOne(query, document)

        return concert
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

export default concertsProvider
