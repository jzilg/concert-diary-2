import type { Concert } from '~/entities/Concert'

export const getAllLocations = (concerts: Concert[]) => [
  ...new Set(concerts.map((concert) => concert.location)),
]
