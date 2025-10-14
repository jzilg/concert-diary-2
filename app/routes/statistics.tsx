import type { FC } from 'react'
import { redirect, useLoaderData } from 'react-router'
import GeneralStatistics from '~/components/GeneralStatistics'
import Header from '~/components/Header'
import MostCommonCompanionsTable from '~/components/MostCommonCompanionsTable'
import MostSeenBands from '~/components/MostSeenBands'
import cachedJson from '~/helpers/cachedJson'
import { getStatisticsOfUser } from '~/logic/statistics'
import { getUserFromRequest } from '~/logic/user'
import type Statistics from '../entities/Statistics'
import type { Route } from './+types/statistics'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Statistics' },
]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const statistics = await getStatisticsOfUser(user.id)

  return cachedJson(request, statistics)
}

const StatisticsRoute: FC = () => {
  const {
    totalBandsCount,
    totalConcertsCount,
    totalFestivalsCount,
    totalLocationsCount,
    mostSeenBands,
    mostCommonCompanions,
  } = useLoaderData<Statistics>()

  return (
    <>
      <Header />
      <main className="container mx-auto">
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-6">Statistics</h2>
          <div className="mb-3">
            <GeneralStatistics
              totalNumOfBands={totalBandsCount}
              totalNumOfConcerts={totalConcertsCount}
              totalNumOfFestivals={totalFestivalsCount}
              totalNumOfLocations={totalLocationsCount}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          <div>
            <MostSeenBands mostSeenBands={mostSeenBands} />
          </div>
          <div>
            <MostCommonCompanionsTable
              mostCommonCompanions={mostCommonCompanions}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default StatisticsRoute
