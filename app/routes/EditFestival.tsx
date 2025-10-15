import { type FC, useEffect } from 'react'
import { data, redirect, useNavigation, useSubmit } from 'react-router'
import { toast } from 'react-toastify'
import FestivalForm from '~/components/FestivalForm'
import type Festival from '~/entities/Festival'
import cachedJson from '~/helpers/cachedJson'
import {
  extractListFromBody,
  extractStringFromBody,
} from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import festivalsProvider from '~/providers/festivalsProvider'
import type { Route } from './+types/EditFestival'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Edit Festival' },
]

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  if (params.id === undefined) {
    return data('no id provided', { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const festival = await festivalsProvider(user.id).getById(params.id)

  return cachedJson(request, festival)
}

export const action = async ({ request }: Route.ActionArgs) => {
  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const body = await request.formData()

  const festivalToUpdate: Festival = {
    id: extractStringFromBody(body)('id'),
    name: extractStringFromBody(body)('name'),
    bands: extractListFromBody(body)('bands'),
    date: {
      from: extractStringFromBody(body)('dateFrom'),
      until: extractStringFromBody(body)('dateUntil'),
    },
    companions: extractListFromBody(body)('companions'),
  }

  await festivalsProvider(user.id).update(festivalToUpdate.id, festivalToUpdate)

  return redirect('/festivals')
}

const EditFestival: FC<Route.ComponentProps> = ({ loaderData }) => {
  const navigation = useNavigation()
  const saveFestival = useSubmit()

  useEffect(() => {
    if (
      navigation.state === 'loading' &&
      navigation.formMethod === 'PUT' &&
      navigation.location.pathname === '/festivals'
    ) {
      toast.success('Festival updated')
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
        festival={loaderData}
        saveFestival={saveFestival}
        method="put"
      />
    </div>
  )
}

export default EditFestival
