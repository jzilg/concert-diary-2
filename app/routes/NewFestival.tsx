import { type FC, useEffect } from 'react'
import { redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import FestivalForm from '~/components/FestivalForm'
import type { Festival } from '~/entities/Festival'
import { createFestival } from '~/entities/Festival'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import todaysDate from '~/helpers/todaysDate'
import { getBands } from '~/logic/bands'
import { getCompanions } from '~/logic/companions'
import { commitSession, getSession } from '~/logic/session'
import { getUserById } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/NewFestival'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | New Festival' },
]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await getUserById(session.get('userId'))

  if (user === undefined) {
    return redirect('/login')
  }

  const concerts = await concertsProvider(user.id).getAll()
  const festivals = await festivalsProvider(user.id).getAll()
  const { allBands } = getBands(concerts, festivals)
  const { allCompanions } = getCompanions(concerts, festivals)

  return cachedJson(request, await commitSession(session), {
    allBands,
    allCompanions,
  })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await getUserById(session.get('userId'))

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()
  const festivalToAdd = createFestival({
    name: extractStringFromBody(body)('name'),
    bands: extractListFromBody(body)('bands'),
    date: {
      from: extractStringFromBody(body)('dateFrom'),
      until: extractStringFromBody(body)('dateUntil'),
    },
    companions: extractListFromBody(body)('companions'),
  })

  await festivalsProvider(user.id).add(festivalToAdd)

  return redirect('/festivals', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const NewFestival: FC<Route.ComponentProps> = ({ loaderData }) => {
  const saveFestival = useSubmit()
  const navigation = useNavigation()
  const festival: Festival = {
    id: '',
    bands: [],
    name: '',
    date: {
      from: todaysDate,
      until: todaysDate,
    },
    companions: [],
  }

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.formMethod === 'POST' &&
      navigation.location.pathname === '/festivals'
    ) {
      toast.success('Festival added')
    }
  }, [navigation.state, navigation.formMethod, navigation.location])

  return (
    <div className="px-6">
      <h2 className="text-2xl mb-6 font-bold">New Festival</h2>
      <FestivalForm
        festival={festival}
        allBands={loaderData.allBands}
        allCompanions={loaderData.allCompanions}
        saveFestival={saveFestival}
        method="post"
      />
    </div>
  )
}

export default NewFestival
