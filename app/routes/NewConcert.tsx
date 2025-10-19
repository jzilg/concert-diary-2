import { type FC, useEffect } from 'react'
import { redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import ConcertForm from '~/components/ConcertForm'
import type { Concert } from '~/entities/Concert'
import { createConcert } from '~/entities/Concert'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import todaysDate from '~/helpers/todaysDate'
import { commitSession, getSession } from '~/logic/session'
import { getUserFromSession } from '~/logic/user'
import concertsProvider from '~/providers/concertsProvider'
import type { Route } from './+types/NewConcert'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | New Concert' },
]

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const user = await getUserFromSession(session)

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

const NewConcert: FC = () => {
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
      <ConcertForm concert={concert} saveConcert={saveConcert} method="post" />
    </div>
  )
}

export default NewConcert
