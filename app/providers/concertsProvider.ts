// biome-ignore-all lint/complexity/useLiteralKeys: biome conflicts with TypeScript rule
import { db } from '~/db'
import type { Concert } from '~/entities/Concert'
import { createConcert } from '~/entities/Concert'
import { splitArray } from '~/helpers/splitArray'

const concertsProvider = (userId: string) => {
  return {
    getAll() {
      const concertData = db
        .prepare('SELECT * FROM concerts WHERE userId = ?')
        .all(userId)

      return concertData.map((concertDate) =>
        createConcert({
          id: concertDate['id'],
          date: concertDate['date'],
          band: concertDate['band'],
          location: concertDate['location'],
          supportBands: splitArray(concertDate['supportBands']),
          companions: splitArray(concertDate['companions']),
        }),
      )
    },

    getById(id: string) {
      const concertData = db
        .prepare('SELECT * FROM concerts WHERE userId = ? AND id = ?')
        .get(userId, id)

      if (concertData === undefined) {
        return undefined
      }

      return createConcert({
        id: concertData['id'],
        date: concertData['date'],
        band: concertData['band'],
        location: concertData['location'],
        supportBands: splitArray(concertData['supportBands']),
        companions: splitArray(concertData['companions']),
      })
    },

    add(concert: Concert) {
      db.prepare(
        'INSERT INTO concerts (id, userId, date, band, supportBands, location, companions) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ).run(
        concert.id,
        userId,
        concert.date,
        concert.band,
        concert.supportBands.join(', '),
        concert.location,
        concert.companions.join(', '),
      )
    },

    update(id: string, concert: Concert) {
      db.prepare(
        'UPDATE concerts SET date = ?, band = ?, supportBands = ?, location = ?, companions = ? WHERE userId = ? AND id = ?',
      ).run(
        concert.date,
        concert.band,
        concert.supportBands.join(', '),
        concert.location,
        concert.companions.join(', '),
        userId,
        id,
      )
    },

    remove(id: string) {
      db.prepare('DELETE FROM concerts WHERE userId = ? AND id = ?').run(
        userId,
        id,
      )
    },
  }
}

export default concertsProvider
