import { type FC, useEffect } from 'react'
import { PlusCircle } from 'react-bootstrap-icons'
import { redirect, useFetcher } from 'react-router'
import { toast } from 'react-toastify'
import ConcertsTable from '~/components/ConcertsTable'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { getSortedConcertsOfUser } from '~/logic/concerts'
import { commitSession, getSession } from '~/logic/session'
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
  const user = await getUserById(session.get('userId'))

  if (user === undefined) {
    return redirect('/login')
  }

  const sortedConcerts = await getSortedConcertsOfUser(user.id)

  return cachedJson(request, await commitSession(session), sortedConcerts)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await getUserById(session.get('userId'))

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()
  const id = extractStringFromBody(body)('id')

  await concertsProvider(user.id).remove(id)

  return new Response(undefined, {
    status: 204,
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const ConcertsView: FC<Route.ComponentProps> = ({ loaderData }) => {
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.formMethod === 'DELETE') {
      toast.success('Concert removed')
    }
  }, [fetcher.formMethod, fetcher.state])

  if (loaderData === undefined) {
    return undefined
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-2xl font-bold">Concerts</h2>
        <ul>
          <li>
            <NavLink to="/concerts/new">
              Add New Concert
              <PlusCircle aria-hidden />
            </NavLink>
          </li>
        </ul>
      </div>
      <ConcertsTable
        concerts={loaderData}
        deleteConcert={(id) => {
          fetcher.submit(
            { id },
            {
              method: 'delete',
            },
          )
        }}
      />
    </>
  )
}

export default ConcertsView
