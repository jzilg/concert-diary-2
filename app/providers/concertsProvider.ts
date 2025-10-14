import type Concert from '~/entities/Concert'
import { createConcert } from '~/entities/Concert'
import client from '../db/client'

const DB = 'concert-diary'
const COLLECTION = 'concerts'

type ConcertsProvider = (userId: string) => {
  getAll(): Promise<Concert[]>
  getById(id: string): Promise<Concert>
  add(concert: Concert): Promise<Concert>
  update(id: string, concert: Concert): Promise<Concert>
  remove(id: string): Promise<void>
}

const concertsProvider: ConcertsProvider = (userId) => {
  const collectionName = `${COLLECTION}-${userId}`

  return {
    async getAll() {
      try {
        await client.connect()
        const db = client.db(DB)
        const collection = db.collection(collectionName)
        const cursor = collection.find()

        const concertDataList = await cursor.toArray()

        return concertDataList.map((concertData) =>
          createConcert(concertData as Object),
        )
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

        const concertData = await collection.findOne(query)

        return createConcert(concertData as Object)
      } finally {
        await client.close()
      }
    },

    async add(concert) {
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
