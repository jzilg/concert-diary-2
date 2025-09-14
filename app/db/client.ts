import { MongoClient } from 'mongodb'
import config from '~/config'

const { dbClient, dbAuthSource, dbAuthUser, dbAuthPassword } = config

const client = new MongoClient(dbClient, {
  authSource: dbAuthSource,
  auth: {
    username: dbAuthUser,
    password: dbAuthPassword,
  },
})

export default client
