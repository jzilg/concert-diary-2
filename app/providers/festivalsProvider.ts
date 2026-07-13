// biome-ignore-all lint/complexity/useLiteralKeys: biome conflicts with TypeScript rule
import { db } from '~/db'
import type { Festival } from '~/entities/Festival'
import { createFestival } from '~/entities/Festival'
import { splitArray } from '~/helpers/splitArray'

const festivalsProvider = (userId: string) => {
  return {
    getAll() {
      const festivalData = db
        .prepare('SELECT * FROM festivals WHERE userId = ?')
        .all(userId)

      return festivalData.map((festivalDate) =>
        createFestival({
          id: festivalDate['id'],
          name: festivalDate['name'],
          date: {
            from: festivalDate['dateFrom'],
            until: festivalDate['dateUntil'],
          },
          bands: splitArray(festivalDate['bands']),
          companions: splitArray(festivalDate['companions']),
        }),
      )
    },

    getById(id: string) {
      const festivalDate = db
        .prepare('SELECT * FROM festivals WHERE userId = ? AND id = ?')
        .get(userId, id)

      if (festivalDate === undefined) {
        return undefined
      }

      return createFestival({
        id: festivalDate['id'],
        name: festivalDate['name'],
        date: {
          from: festivalDate['dateFrom'],
          until: festivalDate['dateUntil'],
        },
        bands: splitArray(festivalDate['bands']),
        companions: splitArray(festivalDate['companions']),
      })
    },

    add(festival: Festival) {
      db.prepare(
        'INSERT INTO festivals (id, userId, dateFrom, dateUntil, name, bands, companions) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ).run(
        festival.id,
        userId,
        festival.date.from,
        festival.date.until,
        festival.name,
        festival.bands.join(', '),
        festival.companions.join(', '),
      )
    },

    update(id: string, festival: Festival) {
      db.prepare(
        'UPDATE festivals SET dateFrom = ?, dateUntil = ?, name = ?, bands = ?, companions = ? WHERE userId = ? AND id = ?',
      ).run(
        festival.date.from,
        festival.date.until,
        festival.name,
        festival.bands.join(', '),
        festival.companions.join(', '),
        userId,
        id,
      )
    },

    remove(id: string) {
      db.prepare('DELETE FROM festivals WHERE userId = ? AND id = ?').run(
        userId,
        id,
      )
    },
  }
}

export default festivalsProvider
