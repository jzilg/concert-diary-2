import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import type Festival from '~/entities/Festival'
import festivalsProvider from '~/providers/festivalsProvider'
import { extractStringFromBody } from '~/helpers/extractFromBody'
import { PlusCircle } from 'react-bootstrap-icons'
import { getUserFromRequest } from '~/logic/user'
import { getSortedFestivalsOfUser } from '~/logic/festivals'
import FestivalsTable from '~/components/FestivalsTable'
import NavLink from '~/components/NavLink'
import cachedJson from '~/helpers/cachedJson'
import type { Route } from './+types/festivals'
import { redirect, useFetcher, useLoaderData } from 'react-router'

export const meta: Route.MetaFunction = () => [{ title: 'Concert Diary | Festivals' }]

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

  return new Response(null, {
    status: 204,
  })
}

const FestivalsView: FC = (props) => {
  const festivals = useLoaderData<Festival[]>()
  const fetcher = useFetcher()

  useEffect(() => {
    if (fetcher.state === 'loading' && fetcher.formMethod === 'DELETE') {
      toast.success('Festival removed')
    }
  }, [fetcher.formMethod, fetcher.state])

  if (!festivals) {
    return null
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
        festivals={festivals}
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
