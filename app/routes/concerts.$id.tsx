import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import concertsProvider from '~/providers/concertsProvider'
import { useLoaderData, useNavigation, useSubmit } from '@remix-run/react'
import type Concert from '~/entities/Concert'
import { extractStringFromBody, extractListFromBody } from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import cachedJson from '~/helpers/cachedJson'

export const meta: MetaFunction = () => [
  { title: 'Concert Diary | Edit Concert' },
]

export const loader: LoaderFunction = async ({ params, request }) => {
  if (params.id === undefined) {
    return json('no id provided', { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const concert = await concertsProvider(user.id).getById(params.id)

  return cachedJson(request, concert)
}

export const action: ActionFunction = async ({ request }) => {
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
    if (navigation.state === 'loading' && navigation.formMethod === 'PUT' && navigation.location.pathname === '/concerts') {
      toast.success('Concert updated')
    }
  }, [navigation.state, navigation.formMethod, navigation.location])

  return (
    <div className="px-6">
      <h2 className="text-2xl mt-10 mb-6 font-bold">Edit Concert</h2>
      <ConcertForm concert={concert} saveConcert={saveConcert} method="put" />
    </div>
  )
}

export default EditConcert
