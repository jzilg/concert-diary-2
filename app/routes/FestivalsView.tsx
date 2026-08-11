import type { FC } from 'react'
import { BoxArrowDown, PlusCircle } from 'react-bootstrap-icons'
import { redirect } from 'react-router'
import Button from '~/components/Button'
import FestivalsTable from '~/components/FestivalsTable'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import { downloadAsJSON } from '~/helpers/downloadAsJson'
import { getSortedFestivals } from '~/logic/festivals'
import {
  commitSession,
  getSession,
  getUserIdFromSession,
} from '~/logic/session'
import { getUserById } from '~/logic/user'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/FestivalsView'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Festivals' },
]

export const headers = ({ loaderHeaders }: Route.HeadersArgs) => {
  return Object.fromEntries(loaderHeaders.entries())
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = getUserById(getUserIdFromSession(session))

  if (user === undefined) {
    return redirect('/login')
  }

  const festivals = festivalsProvider(user.id).getAll()
  const sortedFestivals = getSortedFestivals(festivals)

  return cachedJson(request, await commitSession(session), sortedFestivals)
}

const FestivalsView: FC<Route.ComponentProps> = ({ loaderData }) => {
  if (loaderData === undefined) {
    return undefined
  }

  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-6 px-6">
        <h2 className="text-2xl font-bold">Festivals</h2>
        <ul className="flex">
          <li>
            <NavLink to="/festivals/new">
              Add New Festival
              <PlusCircle aria-hidden />
            </NavLink>
          </li>
          <li>
            <Button
              onClick={() => {
                downloadAsJSON(loaderData, 'festivals_backup.json')
              }}
            >
              Export
              <BoxArrowDown aria-hidden />
            </Button>
          </li>
        </ul>
      </div>
      <FestivalsTable festivals={loaderData} />
    </>
  )
}

export default FestivalsView
