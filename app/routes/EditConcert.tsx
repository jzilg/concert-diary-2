import { type FC, useEffect } from 'react'
import { data, redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import type { Concert } from '~/entities/Concert'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import type { Route } from './+types/EditConcert'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Edit Concert' },
]

export const headers = ({ loaderHeaders }: Route.HeadersArgs) => {
  return Object.fromEntries(loaderHeaders.entries())
}

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  if (params.id === undefined) {
    return data('no id provided', { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const concert = await concertsProvider(user.id).getById(params.id)

  if (concert === undefined) {
    return data('concert not found', { status: 404 })
  }

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

const EditConcert: FC<Route.ComponentProps> = ({ loaderData }) => {
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

  if (typeof loaderData === 'string') {
    return (
      <p className="px-6" role="alert">
        {loaderData}
      </p>
    )
  }

  return (
    <div className="px-6">
      <h2 className="text-2xl mb-6 font-bold">Edit Concert</h2>
      <ConcertForm
        concert={loaderData}
        saveConcert={saveConcert}
        method="put"
      />
    </div>
  )
}

export default EditConcert
