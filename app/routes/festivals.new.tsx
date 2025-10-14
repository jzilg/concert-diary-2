import type { FC } from 'react'
import { useEffect } from 'react'
import { redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import FestivalForm from '~/components/FestivalForm'
import type Festival from '~/entities/Festival'
import { createFestival } from '~/entities/Festival'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import todaysDate from '~/helpers/todaysDate'
import { getUserFromRequest } from '~/logic/user'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/festivals.new'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | New Festival' },
]

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await getUserFromRequest(request)

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

  return redirect('/festivals')
}

const NewFestival: FC = () => {
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
        saveFestival={saveFestival}
        method="post"
      />
    </div>
  )
}

export default NewFestival
