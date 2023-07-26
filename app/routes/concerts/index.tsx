import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ConcertsTable from '~/components/ConcertsTable'
import type Concert from '~/entities/Concert'
import { useFetcher, useLoaderData } from '@remix-run/react'
import type { LoaderFunction, ActionFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import concertsProvider from '~/providers/concertsProvider'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { PlusCircle } from 'react-bootstrap-icons'
import { getUserFromRequest } from '~/logic/user'
import { getSortedConcertsOfUser } from '~/logic/concerts'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'

export const meta: MetaFunction = () => ({
  title: 'Concert Diary | Concerts',
})

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const sortedConcerts = await getSortedConcertsOfUser(user.id)

  return cachedJson(request, sortedConcerts)
}

export const action: ActionFunction = async ({ request }) => {
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
    if (fetcher.type === 'done') {
      toast.success('Concert removed')
    }
  }, [fetcher.type])

  if (!concerts) {
    return null
  }

  return (
    <>
      <div className="flex justify-between items-center mt-10 mb-6 px-6">
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
        deleteConcert={fetcher.submit}
      />
    </>
  )
}

export default ConcertsView
