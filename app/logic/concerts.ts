import type { Concert } from '~/entities/Concert'

export const getSortedConcertsOfUser = (concerts: Concert[]) => {
  const sortedConcerts = concerts.toSorted((concert0, concert1) => {
    const timestamp0 = new Date(concert0.date).getTime()
    const timestamp1 = new Date(concert1.date).getTime()

    return timestamp1 - timestamp0
  })

  return sortedConcerts
}
