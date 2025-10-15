import countBy from 'lodash.countby'
import type { Concert } from '~/entities/Concert'
import type { Festival } from '~/entities/Festival'
import type { MostCommonCompanion } from '~/entities/MostCommonCompanion'
import type { MostSeenBand } from '~/entities/MostSeenBand'
import type { Statistics } from '~/entities/Statistics'
import type { User } from '~/entities/User'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'

type CalcMostSeenBandsParams = {
  mainBands: string[]
  supportBands: string[]
  festivalBands: string[]
  allBands: string[]
}

const calcMostSeenBands = ({
  mainBands,
  supportBands,
  festivalBands,
  allBands,
}: CalcMostSeenBandsParams) => {
  const mainBandsCounts = countBy(mainBands)
  const supportBandsCounts = countBy(supportBands)
  const festivalBandsCounts = countBy(festivalBands)

  return allBands
    .map((bandName) => {
      const mainCount = mainBandsCounts[bandName] ?? 0
      const supportCount = supportBandsCounts[bandName] ?? 0
      const festivalCount = festivalBandsCounts[bandName] ?? 0
      const totalCount = mainCount + supportCount + festivalCount
      const mostSeenBand: MostSeenBand = {
        name: bandName,
        mainCount,
        supportCount,
        festivalCount,
        totalCount,
      }

      return mostSeenBand
    })
    .sort((x, y) => y.festivalCount - x.festivalCount)
    .sort((x, y) => y.mainCount - x.mainCount)
    .sort((x, y) => y.totalCount - x.totalCount)
}

const calcLocationsCount = (concerts: Concert[]) => {
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
  const concertCompanionsCounts = countBy(concertCompanions)
  const festivalCompanions = festivals.flatMap(
    (festival) => festival.companions,
  )
  const festivalCompanionsCounts = countBy(festivalCompanions)
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

  const mainBands = concerts.map((concert) => concert.band)
  const supportBands = concerts.flatMap((concert) => concert.supportBands)
  const festivalBands = festivals.flatMap((festival) => festival.bands)
  const allBands = [
    ...new Set([...mainBands, ...supportBands, ...festivalBands]),
  ]

  return {
    mostSeenBands: calcMostSeenBands({
      mainBands,
      supportBands,
      festivalBands,
      allBands,
    }),
    mostCommonCompanions: calcMostCommonCompanions(concerts, festivals),
    totalConcertsCount: concerts.length,
    totalFestivalsCount: festivals.length,
    totalBandsCount: allBands.length,
    totalLocationsCount: calcLocationsCount(concerts),
  }
}
