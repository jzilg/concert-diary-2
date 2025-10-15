import type { MostCommonCompanion } from './MostCommonCompanion'
import type { MostSeenBand } from './MostSeenBand'

export type Statistics = {
  mostSeenBands: MostSeenBand[]
  mostCommonCompanions: MostCommonCompanion[]
  totalConcertsCount: number
  totalFestivalsCount: number
  totalBandsCount: number
  totalLocationsCount: number
}
