import { type FC, useEffect } from 'react'
import { data, redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import { createConcert } from '~/entities/Concert'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import uncachedJson from '~/helpers/uncachedJson'
import { getBands } from '~/logic/bands'
import { getCompanions } from '~/logic/companions'
import { getAllLocations } from '~/logic/locations'
import {
  commitSession,
  getSession,
  getUserIdFromSession,
} from '~/logic/session'
import { getUserById } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'
import {
  csrfSessionKey,
  getCsrfToken,
  validateCsrfRequest,
} from '~/security/csrf.server'
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

  const session = await getSession(request.headers.get('Cookie'))
  const user = getUserById(getUserIdFromSession(session))

  if (user === undefined) {
    return redirect('/login')
  }

  const concert = concertsProvider(user.id).getById(params.id)

  if (concert === undefined) {
    return data('concert not found', { status: 404 })
  }

  const concerts = concertsProvider(user.id).getAll()
  const festivals = festivalsProvider(user.id).getAll()
  const { allBands } = getBands(concerts, festivals)
  const { allCompanions } = getCompanions(concerts, festivals)
  const allLocations = getAllLocations(concerts)
  const csrfToken = getCsrfToken()
  session.set(csrfSessionKey, csrfToken)

  return uncachedJson(await commitSession(session), {
    csrfToken,
    concert,
    allBands,
    allCompanions,
    allLocations,
  })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const body = await validateCsrfRequest(request, session.get(csrfSessionKey))
  const user = getUserById(getUserIdFromSession(session))

  if (user === undefined) {
    return redirect('/login')
  }

  if (request.method === 'DELETE') {
    const id = extractStringFromBody(body)('id')

    concertsProvider(user.id).remove(id)
  }

  if (request.method === 'PUT') {
    const concertToUpdate = createConcert({
      id: extractStringFromBody(body)('id'),
      band: extractStringFromBody(body)('band'),
      supportBands: extractListFromBody(body)('supportBands'),
      location: extractStringFromBody(body)('location'),
      date: extractStringFromBody(body)('date'),
      companions: extractListFromBody(body)('companions'),
    })

    concertsProvider(user.id).update(concertToUpdate.id, concertToUpdate)
  }

  return redirect('/concerts', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const EditConcert: FC<Route.ComponentProps> = ({ loaderData }) => {
  const navigation = useNavigation()
  const saveConcert = useSubmit()

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.location.pathname === '/concerts' &&
      navigation.formMethod !== undefined
    ) {
      const methodToMessageMap: Record<string, string> = {
        DELETE: 'Concert removed',
        PUT: 'Concert updated',
      }

      const message = methodToMessageMap[navigation.formMethod]

      if (message === undefined) {
        return
      }

      toast.success(message)
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
        concert={loaderData.concert}
        allBands={loaderData.allBands}
        allCompanions={loaderData.allCompanions}
        allLocations={loaderData.allLocations}
        csrfToken={loaderData.csrfToken}
        saveConcert={saveConcert}
        method="put"
      />
    </div>
  )
}

export default EditConcert
