import type Statistics from '~/entities/Statistics'
import type User from '~/entities/User'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'
import type Concert from '../entities/Concert'
import type Festival from '../entities/Festival'
import type MostCommonCompanion from '../entities/MostCommonCompanion'
import type MostSeenBand from '../entities/MostSeenBand'
import countDuplicates from '../helpers/countDuplicates'

const calcMostSeenBands = (
  concerts: Concert[],
  festivals: Festival[],
): MostSeenBand[] => {
  type Band = {
    name: string
    type: 'main' | 'support' | 'festival'
  }

  const bandsFromConcerts = concerts.reduce((accumulator, concert) => {
    const mainBand: Band = {
      name: concert.band,
      type: 'main',
    }
    const supportBands: Band[] = concert.supportBands.map((band) => ({
      name: band,
      type: 'support',
    }))

    return [...accumulator, ...supportBands, mainBand]
  }, [] as Band[])

  const bandsFromFestivals = festivals.reduce((accumulator, festival) => {
    const bands: Band[] = festival.bands.map((band) => ({
      name: band,
      type: 'festival',
    }))

    return [...accumulator, ...bands]
  }, [] as Band[])

  const bands = [...bandsFromConcerts, ...bandsFromFestivals]

  const toMostSeenBands = (
    accumulator: Record<MostSeenBand['name'], MostSeenBand>,
    band: Band,
  ): Record<MostSeenBand['name'], MostSeenBand> => {
    const mainCount = band.type === 'main' ? 1 : 0
    const supportCount = band.type === 'support' ? 1 : 0
    const festivalCount = band.type === 'festival' ? 1 : 0
    const totalCount = 1

    const duplicateEntry = accumulator[band.name]

    const mostSeenBand: MostSeenBand = duplicateEntry
      ? {
          ...duplicateEntry,
          mainCount: duplicateEntry.mainCount + mainCount,
          supportCount: duplicateEntry.supportCount + supportCount,
          festivalCount: duplicateEntry.festivalCount + festivalCount,
          totalCount: duplicateEntry.totalCount + totalCount,
        }
      : {
          name: band.name,
          mainCount,
          supportCount,
          festivalCount,
          totalCount,
        }

    return {
      ...accumulator,
      [band.name]: mostSeenBand,
    }
  }

  return Object.values(bands.reduce(toMostSeenBands, {}))
    .sort((x, y) => y.festivalCount - x.festivalCount)
    .sort((x, y) => y.mainCount - x.mainCount)
    .sort((x, y) => y.totalCount - x.totalCount)
}

const calcBandsCount = (concerts: Concert[], festivals: Festival[]): number => {
  const bands = new Set()

  concerts.forEach((concert) => {
    bands.add(concert.band)
    concert.supportBands.forEach((supportBand) => {
      bands.add(supportBand)
    })
  })

  festivals.forEach((festival) => {
    festival.bands.forEach((supportBand) => {
      bands.add(supportBand)
    })
  })

  return bands.size
}

const calcLocationsCount = (concerts: Concert[]): number => {
  const locations = new Set()

  concerts.forEach((concert) => {
    locations.add(concert.location)
  })

  return locations.size
}

const calcMostCommonCompanions = (
  concerts: Concert[],
  festivals: Festival[],
): MostCommonCompanion[] => {
  const concertCompanions = concerts.flatMap((concert) => concert.companions)
  const concertCompanionsCounts = countDuplicates(concertCompanions)
  const festivalCompanions = festivals.flatMap(
    (festival) => festival.companions,
  )
  const festivalCompanionsCounts = countDuplicates(festivalCompanions)
  const companions = [...new Set([...concertCompanions, ...festivalCompanions])]

  return companions
    .map((companion) => ({
      name: companion,
      concertCount: concertCompanionsCounts[companion] ?? 0,
      festivalCount: festivalCompanionsCounts[companion] ?? 0,
      totalCount:
        (concertCompanionsCounts[companion] ?? 0) +
        (festivalCompanionsCounts[companion] ?? 0),
    }))
    .sort((x, y) => y.totalCount - x.totalCount)
}

export const getStatisticsOfUser = async (
  userId: User['id'],
): Promise<Statistics> => {
  const concerts = await concertsProvider(userId).getAll()
  const festivals = await festivalsProvider(userId).getAll()

  return {
    mostSeenBands: calcMostSeenBands(concerts, festivals),
    mostCommonCompanions: calcMostCommonCompanions(concerts, festivals),
    totalConcertsCount: concerts.length,
    totalFestivalsCount: festivals.length,
    totalBandsCount: calcBandsCount(concerts, festivals),
    totalLocationsCount: calcLocationsCount(concerts),
  }
}
