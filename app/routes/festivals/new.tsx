import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSubmit, useTransition } from '@remix-run/react'
import type Festival from '~/entities/Festival'
import FestivalForm from '~/components/FestivalForm'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import festivalsProvider from '~/providers/festivalsProvider'
import { extractStringFromBody, extractListFromBody } from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import todaysDate from '~/helpers/todaysDate'
import { createFestival } from '~/entities/Festival'

export const meta: MetaFunction = () => ({
  title: 'Concert Diary | New Festival',
})

export const action: ActionFunction = async ({ request }) => {
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
  const transition = useTransition()
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
    if (transition.type === 'actionRedirect') {
      toast.success('Festival added')
    }
  }, [transition.type])

  return (
    <div className="px-6">
      <h2 className="text-2xl mt-10 mb-6 font-bold">New Festival</h2>
      <FestivalForm festival={festival} saveFestival={saveFestival} method="post" />
    </div>
  )
}

export default NewFestival
