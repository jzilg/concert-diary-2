import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import type Festival from '~/entities/Festival'
import FestivalForm from '~/components/FestivalForm'
import festivalsProvider from '~/providers/festivalsProvider'
import { extractStringFromBody, extractListFromBody } from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import todaysDate from '~/helpers/todaysDate'
import { createFestival } from '~/entities/Festival'
import type { Route } from './+types/festivals.new'
import { redirect, useNavigation, useSubmit } from 'react-router'

export const meta: Route.MetaFunction = () => [{ title: 'Concert Diary | New Festival' }]

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
      <FestivalForm festival={festival} saveFestival={saveFestival} method="post" />
    </div>
  )
}

export default NewFestival
