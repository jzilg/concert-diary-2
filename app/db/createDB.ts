import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const db = new DatabaseSync(path.join(__dirname, '../../data/local.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS concerts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    date TEXT NOT NULL,
    band TEXT NOT NULL,
    supportBands TEXT,
    location TEXT,
    companions TEXT
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS festivals (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    dateFrom TEXT NOT NULL,
    dateUntil TEXT NOT NULL,
    name TEXT NOT NULL,
    bands TEXT,
    companions TEXT
  )
`)
