import { DatabaseSync } from 'node:sqlite'

export const db = new DatabaseSync('./data/local.db')

console.log('🪲 sqlite database connected to', db.location())
