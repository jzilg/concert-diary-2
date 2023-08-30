import type { FC } from 'react'
import type { MetaFunction, LoaderFunction } from '@remix-run/node'
import Header from '~/components/Header'
import GeneralStatistics from '~/components/GeneralStatistics'
import MostSeenBands from '~/components/MostSeenBands'
import MostCommonCompanionsTable from '~/components/MostCommonCompanionsTable'
import { redirect } from '@remix-run/node'
import { getUserFromRequest } from '~/logic/user'
import { useLoaderData } from '@remix-run/react'
import { getStatisticsOfUser } from '~/logic/statistics'
import cachedJson from '~/helpers/cachedJson'
import type Statistics from '../entities/Statistics'

export const meta: MetaFunction = () => ({
  title: 'Concert Diary | Statistics',
})

export const loader: LoaderFunction = async ({ request }) => {
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
          <h2 className="text-2xl font-bold mt-10 mb-6">Statistics</h2>
          <div className="mb-3">
            <GeneralStatistics
              totalNumOfBands={totalBandsCount}
              totalNumOfConcerts={totalConcertsCount}
              totalNumOfFestivals={totalFestivalsCount}
              totalNumOfLocations={totalLocationsCount}
            />
          </div>
        </div>
        <div className="lg:flex gap-6">
          <div>
            <MostSeenBands mostSeenBands={mostSeenBands} />
          </div>
          <div>
            <MostCommonCompanionsTable mostCommonCompanions={mostCommonCompanions} />
          </div>
        </div>
      </main>
    </>
  )
}

export default StatisticsRoute
