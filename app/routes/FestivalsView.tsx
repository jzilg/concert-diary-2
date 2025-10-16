import { type FC, useEffect } from 'react'
import { PlusCircle } from 'react-bootstrap-icons'
import { redirect, useFetcher } from 'react-router'
import { toast } from 'react-toastify'
import FestivalsTable from '~/components/FestivalsTable'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { getSortedFestivalsOfUser } from '~/logic/festivals'
import { getUserFromRequest } from '~/logic/user'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/FestivalsView'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Festivals' },
]

export const headers = ({ loaderHeaders }: Route.HeadersArgs) => {
  return Object.fromEntries(loaderHeaders.entries())
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const sortedFestivals = await getSortedFestivalsOfUser(user.id)

  return cachedJson(request, sortedFestivals)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()
  const id = extractStringFromBody(body)('id')

  await festivalsProvider(user.id).remove(id)

  return new Response(undefined, {
    status: 204,
  })
}

const FestivalsView: FC<Route.ComponentProps> = ({ loaderData }) => {
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.formMethod === 'DELETE') {
      toast.success('Festival removed')
    }
  }, [fetcher.formMethod, fetcher.state])

  if (loaderData === undefined) {
    return undefined
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6 px-6">
        <h2 className="text-2xl font-bold">Festivals</h2>
        <ul>
          <li>
            <NavLink to="/festivals/new">
              Add New Festival
              <PlusCircle />
            </NavLink>
          </li>
        </ul>
      </div>
      <FestivalsTable
        festivals={loaderData}
        deleteFestival={(id) => {
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

export default FestivalsView
