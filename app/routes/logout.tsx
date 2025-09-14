import type { FC } from 'react'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import { getSession, destroySession } from '~/logic/session'
import { useEffect } from 'react'

export const meta: MetaFunction = () => [{ title: 'Concert Diary | Logging out...' }]

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'))

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

const Logout: FC = () => {
  const { submit } = useFetcher()

  useEffect(() => {
    submit(null, {
      method: 'post',
    })
  }, [submit])

  return null
}

export default Logout
