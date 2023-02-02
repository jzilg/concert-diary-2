import type Concert from '~/entities/Concert'
import createClient from '../db/createClient'

const DB = 'concert-diary'
const COLLECTION = 'concerts'

type ConcertsProvider = (userId: string) => ({
  getAll(): Promise<Concert[]>
  getById(id: string): Promise<Concert>
  add(concert: Concert): Promise<Concert>
  update(id: string, concert: Concert): Promise<Concert>
  remove(id: string): Promise<void>
})

const concertsProvider: ConcertsProvider = (userId) => {
  const collectionName = `${COLLECTION}-${userId}`

  return {
    async getAll() {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const cursor = collection.find()

        const concerts = await cursor.toArray()

        return concerts as unknown as Concert[]
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

        const concert = await collection.findOne(query)

        return concert as unknown as Concert
      } finally {
        await client.close()
      }
    },

    async add(concert) {
      const client = createClient()

      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)

        await collection.insertOne({ ...concert })

        return concert
      } finally {
        await client.close()
      }
    },

    async update(id, concert) {
      const client = createClient()

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

export default concertsProvider
