import type MostCommonCompanion from './MostCommonCompanion'
import type MostSeenBand from './MostSeenBand'

type Statistics = {
  mostSeenBands: MostSeenBand[]
  mostCommonCompanions: MostCommonCompanion[]
  totalConcertsCount: number
  totalFestivalsCount: number
  totalBandsCount: number
  totalLocationsCount: number
}

export default Statistics
