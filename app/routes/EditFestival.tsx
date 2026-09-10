import { type FC, useEffect } from 'react'
import { data, redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import FestivalForm from '~/components/FestivalForm'
import { createFestival } from '~/entities/Festival'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import { getBands } from '~/logic/bands'
import { getCompanions } from '~/logic/companions'
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
import type { Route } from './+types/EditFestival'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Edit Festival' },
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

  const festival = festivalsProvider(user.id).getById(params.id)

  if (festival === undefined) {
    return data('festival not found', { status: 404 })
  }

  const concerts = concertsProvider(user.id).getAll()
  const festivals = festivalsProvider(user.id).getAll()
  const { allBands } = getBands(concerts, festivals)
  const { allCompanions } = getCompanions(concerts, festivals)
  const csrfToken = getCsrfToken()
  session.set(csrfSessionKey, csrfToken)

  return cachedJson(request, await commitSession(session), {
    csrfToken,
    festival,
    allBands,
    allCompanions,
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

    festivalsProvider(user.id).remove(id)
  }

  if (request.method === 'PUT') {
    const festivalToUpdate = createFestival({
      id: extractStringFromBody(body)('id'),
      name: extractStringFromBody(body)('name'),
      bands: extractListFromBody(body)('bands'),
      date: {
        from: extractStringFromBody(body)('dateFrom'),
        until: extractStringFromBody(body)('dateUntil'),
      },
      companions: extractListFromBody(body)('companions'),
    })

    festivalsProvider(user.id).update(festivalToUpdate.id, festivalToUpdate)
  }

  return redirect('/festivals', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const EditFestival: FC<Route.ComponentProps> = ({ loaderData }) => {
  const navigation = useNavigation()
  const saveFestival = useSubmit()

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.location.pathname === '/festivals' &&
      navigation.formMethod !== undefined
    ) {
      const methodToMessageMap: Record<string, string> = {
        DELETE: 'Festival removed',
        PUT: 'Festival updated',
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
      <h2 className="text-2xl mb-6 font-bold">Edit Festival</h2>
      <FestivalForm
        festival={loaderData.festival}
        allBands={loaderData.allBands}
        allCompanions={loaderData.allCompanions}
        csrfToken={loaderData.csrfToken}
        saveFestival={saveFestival}
        method="put"
      />
    </div>
  )
}

export default EditFestival
