import { MongoClient } from 'mongodb'
import config from '~/config'

const {
  dbClient,
  dbAuthSource,
  dbAuthUser,
  dbAuthPassword,
} = config

const createClient = (): MongoClient => new MongoClient(dbClient, {
  authSource: dbAuthSource,
  auth: {
    username: dbAuthUser,
    password: dbAuthPassword,
  },
})

export default createClient
