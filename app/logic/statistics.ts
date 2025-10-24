import countBy from 'lodash.countby'
import type { Concert } from '~/entities/Concert'
import type { Festival } from '~/entities/Festival'
import type { MostCommonCompanion } from '~/entities/MostCommonCompanion'
import type { MostSeenBand } from '~/entities/MostSeenBand'
import type { Statistics } from '~/entities/Statistics'
import { getBands } from '~/logic/bands'
import { getCompanions } from '~/logic/companions'
import { getAllLocations } from '~/logic/locations'

const calcMostSeenBands = (concerts: Concert[], festivals: Festival[]) => {
  const { mainBands, supportBands, festivalBands, allBands } = getBands(
    concerts,
    festivals,
  )
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

const calcMostCommonCompanions = (
  concerts: Concert[],
  festivals: Festival[],
) => {
  const { festivalCompanions, allCompanions, concertCompanions } =
    getCompanions(concerts, festivals)
  const concertCompanionsCounts = countBy(concertCompanions)
  const festivalCompanionsCounts = countBy(festivalCompanions)

  return allCompanions
    .map((companion) => {
      const mostCommonCompanion: MostCommonCompanion = {
        name: companion,
        concertCount: concertCompanionsCounts[companion] ?? 0,
        festivalCount: festivalCompanionsCounts[companion] ?? 0,
        totalCount:
          (concertCompanionsCounts[companion] ?? 0) +
          (festivalCompanionsCounts[companion] ?? 0),
      }

      return mostCommonCompanion
    })
    .sort((x, y) => y.totalCount - x.totalCount)
}

export const getStatisticsOfUser = (
  concerts: Concert[],
  festivals: Festival[],
) => {
  const { allBands } = getBands(concerts, festivals)
  const allLocations = getAllLocations(concerts)

  const statistics: Statistics = {
    mostSeenBands: calcMostSeenBands(concerts, festivals),
    mostCommonCompanions: calcMostCommonCompanions(concerts, festivals),
    totalConcertsCount: concerts.length,
    totalFestivalsCount: festivals.length,
    totalBandsCount: allBands.length,
    totalLocationsCount: allLocations.length,
  }

  return statistics
}
