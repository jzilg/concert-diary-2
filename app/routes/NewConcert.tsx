import { type FC, useEffect } from 'react'
import { redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import type { Concert } from '~/entities/Concert'
import { createConcert } from '~/entities/Concert'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import todaysDate from '~/helpers/todaysDate'
import { getBands } from '~/logic/bands'
import { getCompanions } from '~/logic/companions'
import { getAllLocations } from '~/logic/locations'
import { commitSession, getSession } from '~/logic/session'
import { getUserById } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/NewConcert'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | New Concert' },
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
  const allLocations = getAllLocations(concerts)

  return cachedJson(request, await commitSession(session), {
    allBands,
    allCompanions,
    allLocations,
  })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await getUserById(session.get('userId'))

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()
  const concertToAdd = createConcert({
    band: extractStringFromBody(body)('band'),
    supportBands: extractListFromBody(body)('supportBands'),
    location: extractStringFromBody(body)('location'),
    date: extractStringFromBody(body)('date'),
    companions: extractListFromBody(body)('companions'),
  })

  await concertsProvider(user.id).add(concertToAdd)

  return redirect('/concerts', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}

const NewConcert: FC<Route.ComponentProps> = ({ loaderData }) => {
  const saveConcert = useSubmit()
  const navigation = useNavigation()
  const concert: Concert = {
    id: '',
    date: todaysDate,
    companions: [],
    band: '',
    location: '',
    supportBands: [],
  }

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.formMethod === 'POST' &&
      navigation.location.pathname === '/concerts'
    ) {
      toast.success('Concert added')
    }
  }, [navigation.state, navigation.formMethod, navigation.location])

  return (
    <div className="px-6">
      <h2 className="text-2xl mb-6 font-bold">New Concert</h2>
      <ConcertForm
        concert={concert}
        allBands={loaderData.allBands}
        allCompanions={loaderData.allCompanions}
        allLocations={loaderData.allLocations}
        saveConcert={saveConcert}
        method="post"
      />
    </div>
  )
}

export default NewConcert
