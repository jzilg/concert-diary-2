import type { FC } from 'react'
import type { MetaFunction, LoaderFunction } from '@remix-run/node'
import Header from '~/components/Header'
import GeneralStatistics from '~/components/GeneralStatistics'
import MostSeenBands from '~/components/MostSeenBands'
import MostCommonCompanionsTable from '~/components/MostCommonCompanionsTable'
import { json, redirect } from '@remix-run/node'
import { getUserFromRequest } from '~/logic/user'
import { useLoaderData } from '@remix-run/react'
import { getStatisticsOfUser } from '~/logic/statistics'
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

  return json(statistics)
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
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mt-10 mb-6">Statistics</h2>
        <div className="mb-3">
          <GeneralStatistics
            totalNumOfBands={totalBandsCount}
            totalNumOfConcerts={totalConcertsCount}
            totalNumOfFestivals={totalFestivalsCount}
            totalNumOfLocations={totalLocationsCount}
          />
        </div>
        <div className="flex gap-6">
          <div>
            <MostSeenBands mostSeenBands={mostSeenBands} />
          </div>
          <div>
            <MostCommonCompanionsTable mostCommonCompanions={mostCommonCompanions} />
          </div>
        </div>
      </div>
    </>
  )
}

export default StatisticsRoute
