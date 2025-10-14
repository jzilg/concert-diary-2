import type { FC } from 'react'
import { useEffect } from 'react'
import {
  data,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from 'react-router'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import type Concert from '~/entities/Concert'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import type { Route } from './+types/concerts.$id'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Edit Concert' },
]

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  if (params.id === undefined) {
    return data('no id provided', { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const concert = await concertsProvider(user.id).getById(params.id)

  return cachedJson(request, concert)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()

  const concertToUpdate: Concert = {
    id: extractStringFromBody(body)('id'),
    band: extractStringFromBody(body)('band'),
    supportBands: extractListFromBody(body)('supportBands'),
    location: extractStringFromBody(body)('location'),
    date: extractStringFromBody(body)('date'),
    companions: extractListFromBody(body)('companions'),
  }

  await concertsProvider(user.id).update(concertToUpdate.id, concertToUpdate)

  return redirect('/concerts')
}

const EditConcert: FC = () => {
  const concert = useLoaderData<Concert>()
  const navigation = useNavigation()
  const saveConcert = useSubmit()

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.formMethod === 'PUT' &&
      navigation.location.pathname === '/concerts'
    ) {
      toast.success('Concert updated')
    }
  }, [navigation.state, navigation.formMethod, navigation.location])

  return (
    <div className="px-6">
      <h2 className="text-2xl mb-6 font-bold">Edit Concert</h2>
      <ConcertForm concert={concert} saveConcert={saveConcert} method="put" />
    </div>
  )
}

export default EditConcert
