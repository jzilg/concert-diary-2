import { type FC, useEffect } from 'react'
import { redirect, useFetcher } from 'react-router'
import { destroySession, getSession } from '~/logic/session'
import type { Route } from './+types/logout'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Logging out...' },
]

export const action = async ({ request }: Route.ActionArgs) => {
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
    void submit(null, {
      method: 'post',
    })
  }, [submit])

  return undefined
}

export default Logout
