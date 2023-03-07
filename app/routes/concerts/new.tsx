import type { FC } from 'react'
import { useEffect } from 'react'
import { useSubmit, useTransition } from '@remix-run/react'
import { toast } from 'react-toastify'
import type Concert from '~/entities/Concert'
import ConcertForm from '~/components/ConcertForm'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import concertsProvider from '~/providers/concertsProvider'
import { extractStringFromBody, extractListFromBody } from '~/helpers/extractFromBody'
import { getUserFromRequest } from '~/logic/user'
import todaysDate from '~/helpers/todaysDate'
import { createConcert } from '~/entities/Concert'

export const meta: MetaFunction = () => ({
  title: 'Concert Diary | New Concert',
})

export const action: ActionFunction = async ({ request }) => {
  const user = await getUserFromRequest(request)

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

  return redirect('/concerts')
}

const NewConcert: FC = () => {
  const saveConcert = useSubmit()
  const transition = useTransition()
  const concert: Concert = {
    id: '',
    date: todaysDate,
    companions: [],
    band: '',
    location: '',
    supportBands: [],
  }

  useEffect(() => {
    if (transition.type === 'actionRedirect') {
      toast.success('Concert added')
    }
  }, [transition.type])

  return (
    <div className="px-6">
      <h2 className="text-2xl mt-10 mb-6 font-bold">New Concert</h2>
      <ConcertForm concert={concert} saveConcert={saveConcert} method="post" />
    </div>
  )
}

export default NewConcert
