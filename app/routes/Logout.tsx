import { type FC, useEffect } from 'react'
import { data, redirect, useFetcher } from 'react-router'
import { commitSession, destroySession, getSession } from '~/logic/session'
import { getCsrfToken, validateCsrfRequest } from '~/security/csrf.server'
import type { Route } from './+types/Logout'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Logging out...' },
]

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))

  return data(
    { csrfToken: getCsrfToken(session) },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  await validateCsrfRequest(request, session)

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}

const Logout: FC<Route.ComponentProps> = ({ loaderData }) => {
  const { submit } = useFetcher()

  useEffect(() => {
    void submit(
      { csrfToken: loaderData.csrfToken },
      {
        method: 'post',
      },
    )
  }, [loaderData.csrfToken, submit])

  return undefined
}

export default Logout
