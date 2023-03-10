import type { FC } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import FestivalForm from '~/components/FestivalForm'
import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import festivalsProvider from '~/providers/festivalsProvider'
import { useLoaderData, useSubmit, useTransition } from '@remix-run/react'
import type Festival from '~/entities/Festival'
import { extractStringFromBody, extractListFromBody } from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'

export const meta: MetaFunction = () => ({
  title: 'Concert Diary | Edit Festival',
})

export const loader: LoaderFunction = async ({ params, request }) => {
  if (params.id === undefined) {
    return json('no id provided', { status: 400 })
  }

  const user = await getUserFromRequest(request)

  if (user === undefined) {
    return redirect('/login')
  }

  const festival = await festivalsProvider(user.id).getById(params.id)

  return json(festival)
}

export const action: ActionFunction = async ({ request }) => {
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

const EditFestival: FC = () => {
  const festival = useLoaderData<Festival>()
  const transition = useTransition()
  const saveFestival = useSubmit()

  useEffect(() => {
    if (transition.type === 'actionRedirect') {
      toast.success('Festival updated')
    }
  }, [transition.type])

  return (
    <div className="px-6">
      <h2 className="text-2xl mt-10 mb-6 font-bold">Edit Festival</h2>
      <FestivalForm festival={festival} saveFestival={saveFestival} method="put" />
    </div>
  )
}

export default EditFestival
