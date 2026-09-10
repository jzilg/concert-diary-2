import { type FC, useEffect } from 'react'
import { redirect, useFetcher } from 'react-router'
import uncachedJson from '~/helpers/uncachedJson'
import { commitSession, destroySession, getSession } from '~/logic/session'
import {
  csrfSessionKey,
  getCsrfToken,
  validateCsrfRequest,
} from '~/security/csrf.server'
import type { Route } from './+types/Logout'

export const meta: Route.MetaFunction = () => [
  { title: 'Concert Diary | Logging out...' },
]

export const headers = ({ loaderHeaders }: Route.HeadersArgs) =>
  Object.fromEntries(loaderHeaders.entries())

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const csrfToken = getCsrfToken()
  session.set(csrfSessionKey, csrfToken)

  return uncachedJson(await commitSession(session), { csrfToken })
}

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  await validateCsrfRequest(request, session.get(csrfSessionKey))

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
