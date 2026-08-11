import type { FC } from 'react'
import { BoxArrowDown, PlusCircle } from 'react-bootstrap-icons'
import { redirect } from 'react-router'
import Button from '~/components/Button'
import ConcertsTable from '~/components/ConcertsTable'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import { downloadAsJSON } from '~/helpers/downloadAsJson'
import { getSortedConcerts } from '~/logic/concerts'
import {
  commitSession,
  getSession,
  getUserIdFromSession,
} from '~/logic/session'
import { getUserById } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import type { Route } from './+types/ConcertsView'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Concerts' },
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

  const concerts = concertsProvider(user.id).getAll()
  const sortedConcerts = getSortedConcerts(concerts)

  return cachedJson(request, await commitSession(session), sortedConcerts)
}

const ConcertsView: FC<Route.ComponentProps> = ({ loaderData }) => {
  if (loaderData === undefined) {
    return undefined
  }

  return (
    <>
      <div className="flex justify-between items-center flex-wrap mb-6 px-6">
        <h2 className="text-2xl font-bold">Concerts</h2>
        <ul className="flex">
          <li>
            <NavLink to="/concerts/new">
              Add New Concert
              <PlusCircle aria-hidden />
            </NavLink>
          </li>
          <li>
            <Button
              onClick={() => {
                downloadAsJSON(loaderData, 'concerts_backup.json')
              }}
            >
              Export
              <BoxArrowDown aria-hidden />
            </Button>
          </li>
        </ul>
      </div>
      <ConcertsTable concerts={loaderData} />
    </>
  )
}

export default ConcertsView
