import type { Concert } from '~/entities/Concert'
import type { Festival } from '~/entities/Festival'

export const getBands = (concerts: Concert[], festivals: Festival[]) => {
  const mainBands = concerts.map((concert) => concert.band)
  const supportBands = concerts.flatMap((concert) => concert.supportBands)
  const festivalBands = festivals.flatMap((festival) => festival.bands)
  const allBands = [
    ...new Set([...mainBands, ...supportBands, ...festivalBands]),
  ]

  return {
    mainBands,
    supportBands,
    festivalBands,
    allBands,
  }
}
