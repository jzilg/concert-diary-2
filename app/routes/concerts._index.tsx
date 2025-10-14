import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ConcertsTable from '~/components/ConcertsTable'
import type Concert from '~/entities/Concert'
import concertsProvider from '~/providers/concertsProvider'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { PlusCircle } from 'react-bootstrap-icons'
import { getUserFromRequest } from '~/logic/user'
import { getSortedConcertsOfUser } from '~/logic/concerts'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import type { Route } from './+types/concerts'
import { redirect, useFetcher, useLoaderData } from 'react-router'

export const meta: Route.MetaFunction = () => [{ title: 'Concert Diary | Concerts' }]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const sortedConcerts = await getSortedConcertsOfUser(user.id)

  return cachedJson(request, sortedConcerts)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()
  const id = extractStringFromBody(body)('id')

  await concertsProvider(user.id).remove(id)

  return new Response(null, {
    status: 204,
  })
}

const ConcertsView: FC = (props) => {
  const concerts = useLoaderData<Concert[]>()
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.formMethod === 'DELETE') {
      toast.success('Concert removed')
    }
  }, [fetcher.formMethod, fetcher.state])

  if (!concerts) {
    return null
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-2xl font-bold">Concerts</h2>
        <ul>
          <li>
            <NavLink to="/concerts/new">
              Add New Concert
              <PlusCircle />
            </NavLink>
          </li>
        </ul>
      </div>
      <ConcertsTable
        concerts={concerts}
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
