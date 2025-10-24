import type { Concert } from '~/entities/Concert'
import type { Festival } from '~/entities/Festival'

export const getCompanions = (concerts: Concert[], festivals: Festival[]) => {
  const concertCompanions = concerts.flatMap((concert) => concert.companions)
  const festivalCompanions = festivals.flatMap(
    (festival) => festival.companions,
  )
  const allCompanions = [
    ...new Set([...concertCompanions, ...festivalCompanions]),
  ]

  return {
    allCompanions,
    festivalCompanions,
    concertCompanions,
  }
}
